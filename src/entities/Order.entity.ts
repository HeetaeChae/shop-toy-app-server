import { PaymentType } from 'src/enums/payment-type.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Address } from './Address.entity';
import { BaseEntity } from './BaseEntity.entity';
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

  @Column({ name: 'receptor_phone', nullable: true })
  receptorPhone: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Address, (address) => address.orders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @OneToMany(() => OrderProduct, (orderProducts) => orderProducts.order)
  orderProducts: OrderProduct[];
}
