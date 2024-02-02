import { PickType } from '@nestjs/swagger';
import { Color } from 'src/enums/color.enum';
import { IsApplied } from 'src/enums/is-applied.enum';
import { Size } from 'src/enums/size.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Order } from './Order.entity';
import { Product } from './Product.entity';

@Entity({ name: 'order_products' })
export class OrderProduct extends BaseEntity {
  @Column({ default: 1 })
  quantity: number;

  @Column({ name: 'sales_amount', default: 0 })
  salesAmount: number;

  @Column({ name: 'sales_price', default: 0 })
  salesPrice: number;

  @Column({ name: 'product_img_url', type: 'text' })
  productImgUrl: string;

  @Column({ name: 'product_name' })
  productName: string;

  @Column({
    name: 'product_size',
    type: 'enum',
    enum: Size,
    default: Size.FREE,
  })
  productSize: Size;

  @Column({
    name: 'product_color',
    type: 'enum',
    enum: Color,
    default: Color.WHITE,
  })
  productColor: Color;

  @Column({
    name: 'is_applied_coupon',
    type: 'enum',
    enum: IsApplied,
    default: IsApplied.NOTAPPLIED,
  })
  isAppliedCoupon: IsApplied;

  @Column({
    name: 'coupon_name',
    nullable: true,
  })
  couponName: string;

  @ManyToOne(() => Order, (order) => order.orderProducts, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderProducts, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
