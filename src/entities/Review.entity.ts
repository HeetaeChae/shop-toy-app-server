import { Rating } from 'src/enums/rating.enum';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Product } from './Product.entity';
import { ReviewComment } from './ReviewComment';
import { User } from './User.entity';

@Entity({ name: 'reviews' })
export class Review extends BaseEntity {
  @Column({ type: 'enum', enum: Rating, default: Rating.THREE })
  rating: Rating;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', name: 'img_url', nullable: true })
  imgUrl: string;

  @ManyToOne(() => User, (user) => user.userReviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => ReviewComment, (reviewComments) => reviewComments.review)
  reviewComments: ReviewComment[];

  @ManyToMany(() => User, (users) => users.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'review_thumbsups',
    joinColumn: { name: 'review_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users: User[];
}
