import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Product } from './Product.entity';
import { User } from './User.entity';

@Entity({ name: 'bought_product' })
export class BoughtProduct extends BaseEntity {
  @ManyToOne(() => User, (user) => user.boughtProducts, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, (product) => product.boughtProducts, {
    onDelete: 'SET NULL',
    cascade: ['soft-remove'],
    nullable: true,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
