import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entities/Review.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    private usersService: UsersService,
  ) {}

  // 첫 번쨰 리뷰인지 확인 (첫 리뷰 쿠폰 증정 확인용)
  async checkIsFirstReview(userId: number) {
    const user = await this.usersService.getUserById(userId);
    const reviews = await this.reviewRepository.find({ where: { user } });
    return reviews.length <= 0;
  }
}
