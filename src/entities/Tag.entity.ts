import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Product } from './Product.entity';

@Entity({ name: 'tags' })
export class Tag extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Product, (products) => products.tags, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'tag_products',
    joinColumn: { name: 'tag_id' },
    inverseJoinColumn: { name: 'product_id' },
  })
  products: Product[];
}
