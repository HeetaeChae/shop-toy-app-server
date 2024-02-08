import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/Product.entity';
import { RecentlyViewedProduct } from 'src/entities/RecentlyViewedProduct.entity';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { RecentlyViewedProductsController } from './recently-viewed-products.controller';
import { RecentlyViewedProductsService } from './recently-viewed-products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecentlyViewedProduct, Product]),
    ProductsModule,
    UsersModule,
  ],
  controllers: [RecentlyViewedProductsController],
  providers: [RecentlyViewedProductsService],
})
export class RecentlyViewedProductsModule {}
