import { PaymentType } from 'src/enums/payment-type.enum';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { OrderProduct } from './OrderProduct.entity';
import { User } from './User.entity';

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
  @Column({ name: 'payment_amount' })
  paymentAmount: number;

  @Column({
    name: 'payment_type',
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.CARD,
  })
  paymentType: PaymentType;

  @Column({ name: 'zip_code', type: 'text' })
  zipCode: string;

  @Column({ name: 'street_address', type: 'text' })
  streetAddress: string;

  @Column({ name: 'receptor_name' })
  receptorName: string;

  @Column({ name: 'receptor_mobile' })
  receptorMobile: string;

  @Column({ name: 'receptor_phone' })
  receptorPhone: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderProduct, (orderProducts) => orderProducts.order)
  orderProducts: OrderProduct[];
}
