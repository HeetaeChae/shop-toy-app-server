import { Color } from 'src/enums/color.enum';
import { Gender } from 'src/enums/gender.enum';
import { Size } from 'src/enums/size.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { CartProduct } from './CartProduct.entity';
import { Category } from './Category.entity';
import { Inquiry } from './Inquiry.entity';
import { OrderProduct } from './OrderProduct.entity';
import { RecentlyViewedProduct } from './RecentlyViewedProduct.entity';
import { Review } from './Review.entity';
import { Tag } from './Tag.entity';
import { User } from './User.entity';
import { Wish } from './Wish.entity';

@Entity({ name: 'products' })
export class Product extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ default: 0 })
  price: number;

  @Column({ name: 'sales_price', default: 0 })
  salesPrice: number;

  @Column({ type: 'enum', enum: Color, default: Color.WHITE })
  color: Color;

  @Column({ name: 'sales_quantity', default: 0 })
  salesQuantity: number;

  @Column({ type: 'enum', enum: Size, default: Size.FREE })
  size: Size;

  @Column({ type: 'enum', enum: Gender, default: Gender.UNISEX })
  gender: Gender;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'img_url_1', type: 'text' })
  imgUrl1: string;

  @Column({ name: 'img_url_2', type: 'text', nullable: true })
  imgUrl2: string;

  @Column({ name: 'img_url_3', type: 'text', nullable: true })
  imgUrl3: string;

  @Column({ name: 'img_url_4', type: 'text', nullable: true })
  imgUrl4: string;

  @Column({ name: 'img_url_5', type: 'text', nullable: true })
  imgUrl5: string;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CartProduct, (cartProducts) => cartProducts.product)
  cartProducts: CartProduct[];

  @OneToMany(() => Review, (reviews) => reviews.product)
  reviews: Review[];

  @OneToMany(() => OrderProduct, (orderProducts) => orderProducts.product)
  orderProducts: OrderProduct[];

  @OneToMany(() => Inquiry, (inquiries) => inquiries.product)
  inquiries: Inquiry;

  @ManyToMany(() => Tag, (tags) => tags.products, { onDelete: 'CASCADE' })
  tags: Tag[];

  @OneToMany(
    () => RecentlyViewedProduct,
    (recentlyViewedProducts) => recentlyViewedProducts.product,
  )
  recentlyViewedProducts: RecentlyViewedProduct[];

  @ManyToMany(() => Wish, (wishes) => wishes.products, {
    onDelete: 'CASCADE',
  })
  wishes: Wish[];

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
