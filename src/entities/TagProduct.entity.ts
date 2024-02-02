import { PickType } from '@nestjs/swagger';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Product } from './Product.entity';
import { Tag } from './Tag.entity';

@Entity({ name: 'tag_products' })
export class TagProduct extends BaseEntity {
  @ManyToOne(() => Tag, (tag) => tag.tagProducts, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @ManyToOne(() => Product, (product) => product.tagProducts, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
