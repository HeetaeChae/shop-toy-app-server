import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsModule } from 'src/carts/carts.module';
import { CouponsModule } from 'src/coupons/coupons.module';
import { User } from 'src/entities/User.entity';
import { WishesModule } from 'src/wishes/wishes.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => CouponsModule),
    forwardRef(() => WishesModule),
    forwardRef(() => CartsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
