import { IsPrimary } from 'src/enums/is-primary.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Order } from './Order.entity';
import { User } from './User.entity';

@Entity({ name: 'addresses' })
export class Address extends BaseEntity {
  @Column({ type: 'text' })
  zip_code: string;

  @Column({ type: 'text' })
  street_address: string;

  @Column()
  address_name: string;

  @Column()
  receptor_name: string;

  @Column()
  receptor_mobile: string;

  @Column({ nullable: true })
  receptor_phone: string;

  @Column({ type: 'enum', enum: IsPrimary, default: IsPrimary.NOTPRIMARY })
  is_primary: IsPrimary;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Order, (orders) => orders.address)
  orders: Order[];
}
