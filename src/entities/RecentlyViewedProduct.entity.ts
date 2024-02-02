import { PickType } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Product } from './Product.entity';
import { User } from './User.entity';

@Entity({ name: 'recently_viewed_products' })
export class RecentlyViewedProduct extends BaseEntity {
  @CreateDateColumn({ name: 'viewed_at' })
  viewedAt: Date;

  @ManyToOne(() => User, (user) => user.recentlyViewedProducts, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, (product) => product.recentlyViewedProducts, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
