import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/Product.entity';
import { Tag } from 'src/entities/Tag.entity';
import { TagProduct } from 'src/entities/TagProduct.entity';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag, TagProduct, Product]),
    UsersModule,
    ProductsModule,
  ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
