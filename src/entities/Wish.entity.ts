import { Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Product } from './Product.entity';
import { User } from './User.entity';

@Entity({ name: 'wishes' })
export class Wish extends BaseEntity {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Product, (products) => products.wishes, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'wish_products',
    joinColumn: { name: 'wish_id' },
    inverseJoinColumn: { name: 'product_id' },
  })
  products: Product[];
}
