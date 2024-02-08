import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ormconfig } from '../ormconfig';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { CartsModule } from './carts/carts.module';
import { CouponsModule } from './coupons/coupons.module';
import { NoticesModule } from './notices/notices.module';
import { ProductsModule } from './products/products.module';
import { TagsModule } from './tags/tags.module';
import { UploadsModule } from './uploads/uploads.module';
import { AddressesModule } from './addresses/addresses.module';
import { RecentlyViewedProductsModule } from './recently-viewed-products/recently-viewed-products.module';
import { SearchesModule } from './searches/searches.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    UsersModule,
    WishesModule,
    CartsModule,
    CouponsModule,
    NoticesModule,
    ProductsModule,
    TagsModule,
    UploadsModule,
    AddressesModule,
    RecentlyViewedProductsModule,
    SearchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
