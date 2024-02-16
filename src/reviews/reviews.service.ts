import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entities/Review.entity';
import { UploadsService } from 'src/uploads/uploads.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { v1 as uuid } from 'uuid';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    private usersService: UsersService,
    private uploadsService: UploadsService,
  ) {}

  // 첫 번쨰 리뷰인지 확인 (첫 리뷰 쿠폰 증정 확인용)
  async checkIsFirstReview(userId: number) {
    const user = await this.usersService.getUserById(userId);
    const reviews = await this.reviewRepository.find({ where: { user } });
    return reviews.length <= 0;
  }

  async uploadReviewImage(file: Express.Multer.File) {
    const imageName = uuid();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.uploadsService.uploadImageToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );

    return { imageUrl };
  }
}
