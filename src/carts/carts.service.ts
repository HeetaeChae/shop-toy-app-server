import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Cart } from 'src/entities/Cart.entity';
import { CartProduct } from 'src/entities/CartProduct.entity';
import { User } from 'src/entities/User.entity';
import { IsChecked } from 'src/enums/is-checked.enum';
import { ProductsService } from 'src/products/products.service';
import { DataSource, Repository } from 'typeorm';
import { CreateCartProductDto } from './dto/create-cart-product.dto';
import { UpdateCartProductDto } from './dto/update-cart-product.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartProduct)
    private cartProductRepository: Repository<CartProduct>,
    private productsService: ProductsService,
    private dataSource: DataSource,
  ) {}

  async getCartById(cartId: number) {
    const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    if (!cart) {
      throw new NotFoundException('장바구니를 찾을 수 없습니다.');
    }
    return cart;
  }

  async getCartProductById(cartProductId: number) {
    const cartProduct = await this.cartProductRepository.findOne({
      where: { id: cartProductId },
    });
    if (!cartProduct) {
      throw new NotFoundException('장바구니 상품을 찾을 수 없습니다.');
    }
    return cartProduct;
  }

  async creatCart(user: User): Promise<Cart | undefined> {
    const newCart = await this.cartRepository.create({
      user: user,
    });
    return this.cartRepository.save(newCart);
  }

  async getCartProducts(userId: number) {
    return this.cartProductRepository
      .createQueryBuilder('cartProducts')
      .leftJoinAndSelect('cartProducts.cart', 'cart')
      .innerJoin('cart.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async checkCart(userId: number, cartId: number) {
    const cartToCheck = await this.getCartById(cartId);
    if (cartToCheck?.user.id !== userId) {
      throw new NotFoundException('헤당 장바구니의 소유자가 아닙니다.');
    }
    const checkedCart = await this.cartRepository.update(cartId, {
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
    cartId,
    productId,
    quantity,
    size,
    color,
  }: CreateCartProductDto & { userId: number }) {
    const product = await this.productsService.getProductById(productId);
    const cart = await this.getCartById(cartId);
    if (cart?.user.id !== userId) {
      throw new ForbiddenException('해당 장바구니의 소유자가 아닙니다.');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 1) 장바구니 체크여부 업데이트
      await this.cartRepository.update(cartId, {
        isChecked: IsChecked.NOTCHECKED,
      });
      // 2) 장바구니에 상품 등록
      const newCartProduct = await this.cartProductRepository.create({
        cart,
        product,
        quantity,
        size,
        color,
      });
      await queryRunner.commitTransaction();
      return this.cartProductRepository.save(newCartProduct);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException(
        '장바구니 등록 과정 중에 오류가 발생했습니다.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteCartProduct(
    userId: number,
    cartId: number,
    cartProductId: number,
  ) {
    const cartProduct = await this.cartRepository
      .createQueryBuilder('cart')
      .innerJoin('cart.cartProduct', 'cartProduct')
      .where('cartProduct.id = :cartProductId', { cartProductId })
      .andWhere('cart.user.id = :userId', { userId })
      .andWhere('cart.id = :cartId', { cartId })
      .getOne();
    if (!cartProduct) {
      throw new ForbiddenException('나의 장바구니 상품만 삭제할 수 있습니다.');
    }
    const deletedCartProduct =
      await this.cartProductRepository.delete(cartProductId);
    if (deletedCartProduct.affected === 0) {
      throw new NotFoundException('장바구니 상품이 삭제되지 않았습니다.');
    }
    return deletedCartProduct;
  }

  async updateCartProduct({
    userId,
    cartId,
    cartProductId,
    quantity,
    size,
    color,
  }: UpdateCartProductDto & {
    userId: number;
    cartId: number;
    cartProductId: number;
  }) {
    const cartProduct = await this.cartRepository
      .createQueryBuilder('cart')
      .innerJoin('cart.cartProduct', 'cartProduct')
      .where('cartProduct.id = :cartProductId', { cartProductId })
      .andWhere('cart.user.id = :userId', { userId })
      .andWhere('cart.id = :cartId', { cartId })
      .getOne();
    if (!cartProduct) {
      throw new ForbiddenException('나의 장바구니 상품만 수정할 수 있습니다.');
    }
    const updatedCartProduct = await this.cartProductRepository.update(
      cartProductId,
      { quantity, size, color },
    );
    if (updatedCartProduct.affected === 0) {
      throw new NotFoundException('장바구니 상품이 수정되지 않았습니다.');
    }
    return updatedCartProduct;
  }
}
