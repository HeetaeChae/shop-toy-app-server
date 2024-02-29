import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoughtProduct } from 'src/entities/BoughtProduct.entity';
import { Product } from 'src/entities/Product.entity';
import { Review } from 'src/entities/Review.entity';
import { ReviewComment } from 'src/entities/ReviewComment.entity';
import { ReviewThumbsup } from 'src/entities/ReviewThumbsup.entity';
import { User } from 'src/entities/User.entity';
import { ReviewOrderBy, ReviewOrderName } from 'src/enums/review-order.enum';
import { ProductsService } from 'src/products/products.service';
import { UploadImageDto } from 'src/uploads/dto/upload-image.dto';
import { UploadsService } from 'src/uploads/uploads.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { v1 as uuid } from 'uuid';
import { CreateReviewDto } from './dto/create-review-dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewsRepository: Repository<Review>,
    @InjectRepository(ReviewThumbsup)
    private reviewThumbsupsRepository: Repository<ReviewThumbsup>,
    @InjectRepository(ReviewComment)
    private reviewCommentsRepository: Repository<ReviewComment>,
    @InjectRepository(BoughtProduct)
    private boughtProductsRepository: Repository<BoughtProduct>,
    private usersService: UsersService,
    private uploadsService: UploadsService,
    private productsService: ProductsService,
  ) {}

  // 첫 번쨰 리뷰인지 확인 (첫 리뷰 쿠폰 증정 확인용)
  async checkIsFirstReview(userId: number): Promise<boolean | undefined> {
    const user = await this.usersService.getUserById(userId);
    const reviews = await this.reviewsRepository.find({ where: { user } });
    return reviews.length <= 0;
  }

  async checkIsExistingReview(user: User, product: Product) {
    const existingReview = await this.reviewsRepository.findOne({
      where: { user, product },
    });
    if (existingReview) {
      throw new ForbiddenException('이미 리뷰를 남겼습니다.');
    }
  }

  // 해당 상품의 모든 리뷰 가져오기
  async getReviews({
    userId,
    productId,
    page,
    pageSize,
    orderName,
    orderBy,
  }: {
    userId: number | undefined;
    productId: number;
    page: number;
    pageSize: number;
    orderName: ReviewOrderName;
    orderBy: ReviewOrderBy;
  }) {
    return this.reviewsRepository
      .createQueryBuilder('reviews')
      .innerJoin('reviews.product', 'product')
      .leftJoinAndSelect('reviews.user', 'reviewer')
      .leftJoinAndSelect('reviews.reviewThumbsups', 'reviewThumbsups')
      .leftJoinAndSelect('reviewThumbsups.user', 'thumbsupUser')
      .leftJoinAndSelect('reviews.reviewComments', 'reviewComments')
      .leftJoinAndSelect('reviewComments.user', 'commentUser')
      .addSelect([
        'thumbsupUser.id AS thumbsupUserId',
        'commentUser.id AS commentUserId',
      ])
      .addSelect([
        'CASE WHEN thumbsupUserId = :userId THEN 1 ELSE 0 END AS thumbsUpByMe',
        'CASE WHEN commentUserId = :userId THEN 1 ELSE 0 END AS commentByMe',
      ])
      .setParameters({ userId })
      .loadRelationCountAndMap('thumbsupCount', 'reviews.reviewThumbsups')
      .loadRelationCountAndMap('commentCount', 'reviews.reviewComments')
      .where('product.id = :productId', { productId })
      .skip((page - 1) * pageSize)
      .take(page * pageSize)
      .orderBy(`reviews.${orderName}`, orderBy)
      .getMany();
  }

  // 내가 쓴 리뷰 가져오기
  async getMyReviews(userId: number) {
    return this.reviewsRepository
      .createQueryBuilder('reviews')
      .innerJoin('reviews.user', 'user')
      .leftJoinAndSelect('reviews.product', 'product')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  // 리뷰 생성 품목 리스트 가져오기
  async getProductsToCreateReview(userId: number) {
    const products = await this.boughtProductsRepository
      .createQueryBuilder('boughtProducts')
      .innerJoin('boughtProducts.user', 'user')
      .leftJoinAndSelect('boughtProducts.product', 'product')
      .leftJoinAndSelect('product.reviews', 'reviews')
      .innerJoin('reviews.user', 'reviewer')
      .where('user.id = :userId', { userId })
      .andWhere('reviewer.id = :reviewerId', { reviewerId: userId })
      .getMany();

    // 해당 상품에 review를 남겼는지 여부
    const productsWithReviewStatus = products.map(
      ({ product, ...boughtProducts }) => {
        const isReview = product.reviews.length > 0;
        return { product: { ...product, isReview }, ...boughtProducts };
      },
    );

    return productsWithReviewStatus;
  }

  // 리뷰 생성하기
  async createReview({
    userId,
    rating,
    content,
    productId,
    file,
  }: { userId: number } & CreateReviewDto & UploadImageDto): Promise<
    Review | undefined
  > {
    const user = await this.usersService.getUserById(userId);
    const product = await this.productsService.getProductById(productId);
    // 이미 리뷰를 남겼는지 체크
    await this.checkIsExistingReview(user, product);
    const imgUrl = await this.uploadsService.getImageUrl(file);
    const newReview = await this.reviewsRepository.create({
      user,
      product,
      imgUrl,
      rating,
      content,
    });
    const savedReview = await this.reviewsRepository.save(newReview);
    if (!savedReview) {
      throw new ForbiddenException('리뷰를 생성하지 못했습니다.');
    }
    return savedReview;
  }
}
