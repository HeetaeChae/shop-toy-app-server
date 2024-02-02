import { PickType } from '@nestjs/swagger';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Review } from './Review.entity';
import { User } from './User.entity';

@Entity({ name: 'review_thumbsups' })
export class ReviewThumbsup extends BaseEntity {
  @ManyToOne(() => User, (user) => user.reviewThumbsups, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Review, (review) => review.reviewThumbsups, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'review_id' })
  review: Review;
}
