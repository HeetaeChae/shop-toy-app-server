import { PickType } from '@nestjs/swagger';
import { IsActive } from 'src/enums/is-active.enum';
import { IsUsed } from 'src/enums/is-used.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Coupon } from './Coupon.entity';
import { User } from './User.entity';

@Entity({ name: 'user_coupons' })
export class UserCoupon extends BaseEntity {
  @Column({
    name: 'is_used',
    type: 'enum',
    enum: IsUsed,
    default: IsUsed.NOTUSED,
  })
  isUsed: IsUsed;

  @Column({
    name: 'is_active',
    type: 'enum',
    enum: IsActive,
    default: IsActive.ACTIVE,
  })
  isActive: IsActive;

  @Column({ name: 'expired_at', type: 'timestamp' })
  expiredAt: Date;

  @ManyToOne(() => User, (user) => user.userCoupons, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Coupon, (coupon) => coupon.userCoupons, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;
}
