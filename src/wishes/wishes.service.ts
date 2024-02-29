import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/Product.entity';
import { User } from 'src/entities/User.entity';
import { Wish } from 'src/entities/Wish.entity';
import { WishProduct } from 'src/entities/WishProduct.entity';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { DeleteResult, Repository } from 'typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishsRepository: Repository<Wish>,
    @InjectRepository(WishProduct)
    private wishProductsRepository: Repository<WishProduct>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
    private dataSource: DataSource,
  ) {}

  async checkIsExistWish(user: User): Promise<void | undefined> {
    const existWish = await this.wishsRepository.findOne({ where: { user } });
    if (existWish) {
      throw new ConflictException('이미 찜 데이터가 존재합니다.');
    }
  }

  async getWishByUserId(userId: number) {
    const user = await this.usersService.getUserById(userId);
    const wish = await this.wishsRepository.findOne({ where: { user } });
    if (!wish) {
      throw new NotFoundException('내 찜이 존재하지 않습니다.');
    }
    return wish;
  }

  async checkIsExistWishProduct(wish: Wish, product: Product) {
    const existWishProduct = await this.wishProductsRepository.findOne({
      where: { wish, product },
    });
    if (existWishProduct) {
      throw new ConflictException('이미 존재하는 찜 상품입니다.');
    }
  }

  async checkIsOwnWishProduct(wish: Wish, cartProductId: number) {
    const ownWishProduct = await this.wishProductsRepository.findOne({
      where: { wish, id: cartProductId },
    });
    if (!ownWishProduct) {
      throw new NotFoundException('찜 데이터가 존재하지 않습니다.');
    }
  }

  async getWishProducts(userId: number): Promise<WishProduct[] | undefined> {
    return (
      this.wishProductsRepository
        .createQueryBuilder('wishProducts')
        .leftJoinAndSelect('wishProducts.product', 'product')
        // join된 product와 관계된 모든 wishProducts의 length값을 출력
        .addSelect(
          '(SELECT COUNT(*) FROM wish_products WHERE wish_products.product_id = product.id)',
          'wishProductsCount',
        )
        .innerJoin('wishProducts.wish', 'wish')
        .innerJoin('wish.user', 'user')
        .where('user.id = :userId', { userId })
        .getMany()
    );
  }

  async createWishProduct(
    userId: number,
    productId: number,
  ): Promise<WishProduct | undefined> {
    const wish = await this.getWishByUserId(userId);
    const product = await this.productsService.getProductById(productId);
    await this.checkIsExistWishProduct(wish, product);
    const newWishProduct = await this.wishProductsRepository.create({
      wish,
      product,
    });
    return this.wishProductsRepository.save(newWishProduct);
  }

  async deleteWishProducts(userId: number): Promise<void> {
    const wishProducts = await this.getWishProducts(userId);
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const wishProduct of wishProducts) {
        await this.deleteWishProduct(userId, wishProduct.id);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async deleteWishProduct(
    userId: number,
    wishProductId: number,
  ): Promise<DeleteResult | undefined> {
    const wish = await this.getWishByUserId(userId);
    await this.checkIsOwnWishProduct(wish, wishProductId);
    const deletedWishProduct =
      await this.wishProductsRepository.softDelete(wishProductId);
    if (deletedWishProduct.affected === 0) {
      throw new ForbiddenException('찜 상품을 삭제할 수 없습니다.');
    }
    return deletedWishProduct;
  }
}
