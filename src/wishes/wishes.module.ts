import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from 'src/entities/Wish.entity';
import { WishProduct } from 'src/entities/WishProduct.entity';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish, WishProduct]),
    forwardRef(() => UsersModule),
    forwardRef(() => ProductsModule),
  ],
  controllers: [WishesController],
  providers: [WishesService],
  exports: [WishesService],
})
export class WishesModule {}
