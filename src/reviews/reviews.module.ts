import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoughtProduct } from 'src/entities/BoughtProduct.entity';
import { Review } from 'src/entities/Review.entity';
import { ReviewComment } from 'src/entities/ReviewComment.entity';
import { ReviewThumbsup } from 'src/entities/ReviewThumbsup.entity';
import { ProductsModule } from 'src/products/products.module';
import { UploadsModule } from 'src/uploads/uploads.module';
import { UsersModule } from 'src/users/users.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review,
      ReviewThumbsup,
      ReviewComment,
      BoughtProduct,
    ]),
    UsersModule,
    UploadsModule,
    ProductsModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
