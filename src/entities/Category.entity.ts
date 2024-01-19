import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Product } from './Product.entity';

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Product, (products) => products.category)
  products: Product[];
}
