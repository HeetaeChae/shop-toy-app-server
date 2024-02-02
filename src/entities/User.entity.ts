import { Roles } from 'src/enums/roles.enum';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Address } from './Address.entity';
import { BaseEntity } from './BaseEntity.entity';
import { Inquiry } from './Inquiry.entity';
import { InquiryComment } from './InquiryComment.entity';
import { Notice } from './Notice.entity';
import { Order } from './Order.entity';
import { Product } from './Product.entity';
import { RecentlyViewedProduct } from './RecentlyViewedProduct.entity';
import { Review } from './Review.entity';
import { ReviewComment } from './ReviewComment.entity';
import { ReviewThumbsup } from './ReviewThumbsup.entity';
import { Search } from './Search.entity';
import { UserCoupon } from './UserCoupon.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  nickname: string;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.USER })
  roles: Roles;

  @OneToMany(() => Notice, (notices) => notices.user)
  notices: Notice[];

  @OneToMany(() => Product, (products) => products.user)
  products: Product[];

  @OneToMany(() => Review, (userReviews) => userReviews.user)
  userReviews: Review[];

  @OneToMany(() => ReviewComment, (reviewComments) => reviewComments.user)
  reviewComments: ReviewComment[];

  /*
  @ManyToMany(() => Review, (reviews) => reviews.users, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  reviews: Review[];
  */

  @OneToMany(() => ReviewThumbsup, (reviewThumbsups) => reviewThumbsups.user)
  reviewThumbsups: ReviewThumbsup[];

  @OneToMany(() => Order, (orders) => orders.user)
  orders: Order[];

  @OneToMany(() => Search, (searches) => searches.user)
  searches: Search[];

  @OneToMany(() => Inquiry, (inquiries) => inquiries.user)
  inquiries: Inquiry;

  @OneToMany(() => InquiryComment, (inquiryComments) => inquiryComments.user)
  inquiryComments: InquiryComment[];

  @OneToMany(
    () => RecentlyViewedProduct,
    (recentlyViewedProducts) => recentlyViewedProducts.user,
  )
  recentlyViewedProducts: RecentlyViewedProduct[];

  @OneToMany(() => Address, (addresses) => addresses.user)
  addresses: Address[];

  @OneToMany(() => UserCoupon, (userCoupons) => userCoupons.user)
  userCoupons: UserCoupon[];
}
