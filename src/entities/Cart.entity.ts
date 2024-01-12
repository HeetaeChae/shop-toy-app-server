import { IsChecked } from 'src/enums/is-checked.enum';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { CartProduct } from './CartProduct.entity';
import { User } from './User.entity';

@Entity({ name: 'carts' })
export class Cart extends BaseEntity {
  @Column({
    name: 'is_checked',
    type: 'enum',
    enum: IsChecked,
    default: IsChecked.CHECKED,
  })
  isChecked: IsChecked;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CartProduct, (cartProducts) => cartProducts.cart)
  cartProducts: CartProduct[];
}
