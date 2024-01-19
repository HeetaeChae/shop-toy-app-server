import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from 'src/entities/Coupon.entity';
import { UserCoupon } from 'src/entities/UserCoupon.entity';
import { UsersModule } from 'src/users/users.module';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coupon, UserCoupon]),
    // 순환성의존 해결
    forwardRef(() => UsersModule),
  ],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
