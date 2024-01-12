import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Product } from './Product.entity';

@Entity({ name: 'tags' })
export class Tag extends BaseEntity {
  @Column({ type: 'text', unique: true })
  name: string;

  @ManyToMany(() => Product, (products) => products.tags, {
    onDelete: 'CASCADE',
  })
  products: Product[];
}
