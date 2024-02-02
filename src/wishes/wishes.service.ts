import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { Wish } from 'src/entities/Wish.entity';
import { WishProduct } from 'src/entities/WishProduct.entity';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish) private wishsRepository: Repository<Wish>,
    @InjectRepository(WishProduct)
    private wishProductsRepository: Repository<WishProduct>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  async createWish(user: User): Promise<Wish | undefined> {
    const newWish = this.wishsRepository.create({
      user,
    });
    return this.wishsRepository.save(newWish);
  }

  async getWishById(wishId: number) {
    return this.wishsRepository.findOne({ where: { id: wishId } });
  }

  async getWishProducts(userId: number) {
    const wish = await this.wishsRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.wishProducts', 'wishProducts')
      .where('wish.userId= :userId', { userId })
      .getOne();
    if (!wish) {
      throw new NotFoundException('존재하지 않는 데이터입니다.');
    }
    return wish;
  }

  async createWishProduct(
    userId: number,
    wishId: number,
    productId: number,
  ): Promise<WishProduct | undefined> {
    const wish = await this.getWishById(wishId);
    if (!wish) {
      throw new ForbiddenException('존재하지 않는 찜 데이터입니다.');
    }
    const isWishOwner = wish.user.id === userId;
    if (!isWishOwner) {
      throw new ForbiddenException('본인의 찜 데이터가 아닙니다.');
    }
    const product = await this.productsService.getProductById(productId);
    if (!product) {
      throw new NotFoundException('존재하지 않는 상품입니다.');
    }
    const newWishProduct = await this.wishProductsRepository.create({
      wish,
      product,
    });
    return this.wishProductsRepository.save(newWishProduct);
  }

  async deleteWishProducts(userId: number, wishId: number): Promise<void> {
    const wish = await this.wishsRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.wishProducts', 'wishProducts')
      .where('wish.id = :id', { id: wishId })
      .getOne();
    const isWishOwner = wish.user.id === userId;
    if (!isWishOwner) {
      throw new ForbiddenException('본인의 찜 데이터가 아닙니다.');
    }
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const wishProduct of wish.wishProducts) {
        await this.wishProductsRepository.softDelete({ id: wishProduct.id });
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
    wishId: number,
    productId: number,
  ): Promise<void> {
    const wish = await this.wishsRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.wishProducts', 'wishProducts')
      .innerJoin('wishProducts.product', 'product')
      .where('wish.id = :wishId', { wishId })
      .andWhere('product.id = :productId', { productId })
      .getOne();
    const isWishOwner = wish.user.id === userId;
    if (!isWishOwner) {
      throw new ForbiddenException('본인의 찜 데이터가 아닙니다.');
    }
    const wishProductId = wish.wishProducts[0].id;
    if (!wishProductId) {
      throw new NotFoundException('찜한 상품이 존재하지 않습니다.');
    }
    await this.wishProductsRepository.softDelete({
      id: wishProductId,
    });
  }
}
