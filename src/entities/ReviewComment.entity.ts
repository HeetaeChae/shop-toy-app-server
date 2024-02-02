import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Review } from './Review.entity';
import { User } from './User.entity';

@Entity({ name: 'review_comments' })
export class ReviewComment extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, (user) => user.reviewComments, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Review, (review) => review.reviewComments, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'review_id' })
  review: Review;
}
