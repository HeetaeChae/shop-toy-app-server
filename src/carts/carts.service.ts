import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Cart } from 'src/entities/Cart.entity';
import { CartProduct } from 'src/entities/CartProduct.entity';
import { Product } from 'src/entities/Product.entity';
import { User } from 'src/entities/User.entity';
import { IsChecked } from 'src/enums/is-checked.enum';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateCartProductDto } from './dto/create-cart-product.dto';
import { UpdateCartProductDto } from './dto/update-cart-product.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private cartsRepository: Repository<Cart>,
    @InjectRepository(CartProduct)
    private cartProductsRepository: Repository<CartProduct>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private dataSource: DataSource,
  ) {}

  async creatCart(user: User): Promise<Cart | undefined> {
    await this.checkIsExistCart(user);
    const newCart = this.cartsRepository.create({
      user,
    });
    return newCart;
  }

  async checkIsExistCart(user: User): Promise<void | undefined> {
    const existCart = await this.cartsRepository.findOne({ where: { user } });
    if (existCart) {
      throw new ConflictException('이미 장바구니가 생성되어있습니다.');
    }
  }

  async getCartById(cartId: number): Promise<Cart | undefined> {
    const cart = await this.cartsRepository.findOne({ where: { id: cartId } });
    if (!cart) {
      throw new NotFoundException('장바구니를 찾을 수 없습니다.');
    }
    return cart;
  }

  async getCartByUserId(userId: number): Promise<Cart | undefined> {
    const user = await this.usersService.getUserById(userId);
    const cart = await this.cartsRepository.findOne({ where: { user } });
    if (!cart) {
      throw new NotFoundException('내 장바구니가 존재하지 않습니다.');
    }
    return cart;
  }

  async checkIsOwnCartProduct(
    cart: Cart,
    cartProductId: number,
  ): Promise<void | undefined> {
    const ownCartProduct = await this.cartProductsRepository.findOne({
      where: { id: cartProductId, cart },
    });
    if (!ownCartProduct) {
      throw new NotFoundException('내 장바구니 상품을 찾을 수 없습니다.');
    }
  }

  async checkIsExistCarProduct(
    cart: Cart,
    product: Product,
  ): Promise<void | undefined> {
    const existCartProduct = await this.cartProductsRepository.findOne({
      where: { cart, product },
    });
    if (existCartProduct) {
      throw new ConflictException('이미 등록된 장바구니 상품입니다.');
    }
  }

  async getCartProducts(userId: number): Promise<CartProduct[] | undefined> {
    return this.cartProductsRepository
      .createQueryBuilder('cartProducts')
      .leftJoinAndSelect('cartProducts.product', 'product')
      .innerJoin('cartProducts.cart', 'cart')
      .innerJoin('cart.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async checkCart(userId: number) {
    const cart = await this.getCartByUserId(userId);
    const checkedCart = await this.cartsRepository.update(cart?.id, {
      isChecked: IsChecked.CHECKED,
      checkedAt: dayjs(),
    });
    if (checkedCart.affected === 0) {
      throw new ForbiddenException('장바구니 확인 체크가 실행되지 않았습니다.');
    }
    return checkedCart;
  }

  async createCartProduct({
    userId,
    productId,
    quantity,
    size,
    color,
  }: CreateCartProductDto & { userId: number }): Promise<
    CartProduct | undefined
  > {
    const cart = await this.getCartByUserId(userId);
    const product = await this.productsService.getProductById(productId);
    await this.checkIsExistCarProduct(cart, product);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 1) 장바구니 체크여부 업데이트
      await this.cartsRepository.update(cart.id, {
        isChecked: IsChecked.NOT_CHECKED,
      });
      // 2) 장바구니에 상품 등록
      const newCartProduct = await this.cartProductsRepository.create({
        cart,
        product,
        quantity,
        size,
        color,
      });
      await queryRunner.commitTransaction();
      return this.cartProductsRepository.save(newCartProduct);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException(
        '장바구니 등록 과정 중에 오류가 발생했습니다.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateCartProduct({
    userId,
    cartProductId,
    quantity,
    size,
    color,
  }: UpdateCartProductDto & {
    userId: number;
    cartProductId: number;
  }): Promise<UpdateResult | undefined> {
    const cart = await this.getCartByUserId(userId);
    await this.checkIsOwnCartProduct(cart, cartProductId);
    const updatedCartProduct = await this.cartProductsRepository.update(
      cartProductId,
      { quantity, size, color },
    );
    if (updatedCartProduct.affected === 0) {
      throw new NotFoundException('장바구니 상품이 수정되지 않았습니다.');
    }
    return updatedCartProduct;
  }

  async deleteCartProduct(
    userId: number,
    cartProductId: number,
  ): Promise<DeleteResult | undefined> {
    const cart = await this.getCartByUserId(userId);
    await this.checkIsOwnCartProduct(cart, cartProductId);
    const deletedCartProduct =
      await this.cartProductsRepository.softDelete(cartProductId);
    if (deletedCartProduct.affected === 0) {
      throw new NotFoundException('장바구니 상품이 삭제되지 않았습니다.');
    }
    return deletedCartProduct;
  }
}
