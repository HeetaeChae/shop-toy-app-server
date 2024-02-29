import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities/Cart.entity';

import { Coupon } from 'src/entities/Coupon.entity';
import { User } from 'src/entities/User.entity';
import { UserCoupon } from 'src/entities/UserCoupon.entity';
import { Wish } from 'src/entities/Wish.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserCoupon, Coupon, Wish, Cart])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
