import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { User } from './User.entity';
import { WishProduct } from './WishProduct.entity';

@Entity({ name: 'wishes' })
export class Wish extends BaseEntity {
  @OneToOne(() => User, { onDelete: 'CASCADE', cascade: ['soft-remove'] })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /*
  @ManyToMany(() => Product, (products) => products.wishes, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'wish_products',
    joinColumn: { name: 'wish_id' },
    inverseJoinColumn: { name: 'product_id' },
  })
  products: Product[];
  */

  @OneToMany(() => WishProduct, (wishProducts) => wishProducts.wish)
  wishProducts: WishProduct[];
}
