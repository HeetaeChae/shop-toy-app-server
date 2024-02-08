import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/Product.entity';
import { RecentlyViewedProduct } from 'src/entities/RecentlyViewedProduct.entity';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class RecentlyViewedProductsService {
  constructor(
    @InjectRepository(RecentlyViewedProduct)
    private recentlyViewedProductsRepository: Repository<RecentlyViewedProduct>,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  async getMyRecentlyViewedProducts(userId: number) {
    return this.recentlyViewedProductsRepository
      .createQueryBuilder('recentlyViewedProducts')
      .leftJoinAndSelect('recentlyViewedProducts.product', 'product')
      .innerJoin('recentlyViewedProducts.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('recentlyViewedProducts.viewedAt', 'DESC')
      .groupBy('recentlyViewedProducts.product')
      .limit(5)
      .getMany();
  }

  async getTrendRecentlyViewedProducts() {
    return this.recentlyViewedProductsRepository
      .createQueryBuilder('recentlyViewedProducts')
      .leftJoinAndSelect('recentlyViewedProducts.product', 'product')
      .select(
        'recentlyViewedProducts.product, COUNT(recentlyViewedProducts.product) as viewedCount',
      )
      .groupBy('recentlyViewedProducts.product')
      .orderBy('viewedCount', 'DESC')
      .limit(5)
      .getMany();
  }

  async createRecentlyViewedProduct(userId: number, productId: number) {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    }
    const product = await this.productsService.getProductById(productId);
    if (!product) {
      throw new NotFoundException('해당 상품이 존재하지 않습니다.');
    }
    const newRecentlyViewedProduct =
      await this.recentlyViewedProductsRepository.create({ user, product });
    return this.recentlyViewedProductsRepository.save(newRecentlyViewedProduct);
  }

  async deleteRecentlyViewedProduct(userId: number, id: number) {
    const recentlyViewedProductToDelete =
      await this.recentlyViewedProductsRepository.findOne({ where: { id } });
    if (recentlyViewedProductToDelete.user.id !== userId) {
      throw new ForbiddenException('등록하신 데이터가 아닙니다.');
    }
    const deletedRecentlyViewedProduct =
      await this.recentlyViewedProductsRepository.delete(id);
    if (!deletedRecentlyViewedProduct) {
      throw new NotFoundException('최근 본 상품이 삭제되지 않았습니다.');
    }
    return deletedRecentlyViewedProduct;
  }
}
