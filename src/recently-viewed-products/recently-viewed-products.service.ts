import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/Product.entity';
import { RecentlyViewedProduct } from 'src/entities/RecentlyViewedProduct.entity';
import { User } from 'src/entities/User.entity';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class RecentlyViewedProductsService {
  constructor(
    @InjectRepository(RecentlyViewedProduct)
    private recentlyViewedProductsRepository: Repository<RecentlyViewedProduct>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  // 3번 본 상품인지 체크
  async checkIsThreeTimesRecentlyViewedProduct(
    user: User,
    product: Product,
  ): Promise<boolean | undefined> {
    const isThreeTimesRecentlyViewedProduct =
      await this.recentlyViewedProductsRepository.find({
        where: { user, product },
      });
    return isThreeTimesRecentlyViewedProduct.length === 3;
  }

  // 내가 최근 본 상품인지 여부 체크
  async checkIsOwnRecentlyViewedProduct(
    user: User,
    id: number,
  ): Promise<void | undefined> {
    const isOwnRecentlyViewedProduct =
      await this.recentlyViewedProductsRepository.findOne({
        where: { id, user },
      });
    if (!isOwnRecentlyViewedProduct) {
      throw new ForbiddenException('내가 최근 본 상품이 아닙니다.');
    }
  }

  // 내가 최근 본 상품 5개 가져오기
  async getMyRecentlyViewedProducts(userId: number) {}

  // 최근 가장 많이 클릭된 트렌드 상품 5개 가져오기
  async getTrendRecentlyViewedProducts() {}

  // 최근 본 상품 등록
  async createRecentlyViewedProduct(
    userId: number,
    productId: number,
  ): Promise<
    | {
        savedRecentlyViewedProduct: RecentlyViewedProduct;
        isThreeTimesRecentlyViewedProduct: boolean;
      }
    | undefined
  > {
    const user = await this.usersService.getUserById(userId);
    const product = await this.productsService.getProductById(productId);
    const newRecentlyViewedProduct =
      await this.recentlyViewedProductsRepository.create({
        user,
        product,
        productIdForGrouping: productId,
      });
    const savedRecentlyViewedProduct =
      await this.recentlyViewedProductsRepository.save(
        newRecentlyViewedProduct,
      );
    const isThreeTimesRecentlyViewedProduct =
      await this.checkIsThreeTimesRecentlyViewedProduct(user, product);
    return { savedRecentlyViewedProduct, isThreeTimesRecentlyViewedProduct };
  }

  // 최근 본 상품 삭제
  async deleteRecentlyViewedProduct(
    userId: number,
    id: number,
  ): Promise<DeleteResult | undefined> {
    const user = await this.usersService.getUserById(userId);
    await this.checkIsOwnRecentlyViewedProduct(user, id);
    const deletedRecentlyViewedProduct =
      await this.recentlyViewedProductsRepository.softDelete(id);
    if (deletedRecentlyViewedProduct.affected === 0) {
      throw new NotFoundException('최근 본 상품이 삭제되지 않았습니다.');
    }
    return deletedRecentlyViewedProduct;
  }
}
