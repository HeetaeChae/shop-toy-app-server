import { PickType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Color } from 'src/enums/color.enum';
import { Size } from 'src/enums/size.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Cart } from './Cart.entity';
import { Product } from './Product.entity';

@Entity({ name: 'cart_products' })
export class CartProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  @IsEnum(Color)
  color: Color;

  @Column()
  @IsEnum(Size)
  size: Size;

  @ManyToOne(() => Cart, (cart) => cart.cartProducts, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartProducts, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
