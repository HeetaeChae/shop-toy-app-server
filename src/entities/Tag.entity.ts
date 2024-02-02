import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Product } from './Product.entity';
import { TagProduct } from './TagProduct.entity';

@Entity({ name: 'tags' })
export class Tag extends BaseEntity {
  @Column({ unique: true })
  name: string;

  /*
  @ManyToMany(() => Product, (products) => products.tags, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'tag_products',
    joinColumn: { name: 'tag_id' },
    inverseJoinColumn: { name: 'product_id' },
  })
  products: Product[];
  */

  @OneToMany(() => TagProduct, (tagProducts) => tagProducts.tag)
  tagProducts: TagProduct[];
}
