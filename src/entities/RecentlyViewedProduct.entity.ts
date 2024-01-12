import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './Product.entity';
import { User } from './User.entity';

@Entity({ name: 'recently_viewed_products' })
export class RecentlyViewedProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'viewed_at' })
  viewedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.recentlyViewedProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, (product) => product.recentlyViewedProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
