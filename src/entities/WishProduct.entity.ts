import { ApiTags, PickType } from '@nestjs/swagger';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Product } from './Product.entity';
import { Wish } from './Wish.entity';

@Entity({ name: 'wish_products' })
export class WishProduct extends BaseEntity {
  @ManyToOne(() => Wish, (wish) => wish.wishProducts, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'wish_id' })
  wish: Wish;

  @ManyToOne(() => Product, (product) => product.wishProducts, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
