import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities/Cart.entity';
import { CartProduct } from 'src/entities/CartProduct.entity';
import { Product } from 'src/entities/Product.entity';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartProduct, Product]),
    forwardRef(() => UsersModule),
    forwardRef(() => ProductsModule),
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
