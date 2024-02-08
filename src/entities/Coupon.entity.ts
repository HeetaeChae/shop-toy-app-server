import { IsActive } from 'src/enums/is-active.enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { UserCoupon } from './UserCoupon.entity';

@Entity({ name: 'coupons' })
export class Coupon extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ default: 0 })
  discountAmount: number;

  @OneToMany(() => UserCoupon, (userCoupons) => userCoupons.coupon)
  userCoupons: UserCoupon[];
}
