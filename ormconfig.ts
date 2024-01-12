import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Cart } from 'src/entities/Cart.entity';
import { CartProduct } from 'src/entities/CartProduct.entity';
import { Notice } from 'src/entities/Notice.entity';
import { Product } from 'src/entities/Product.entity';
import { Review } from 'src/entities/Review.entity';
import { ReviewComment } from 'src/entities/ReviewComment';
import { User } from 'src/entities/User.entity';

dotenv.config();
export const ormconfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Notice, Cart, CartProduct, Product, Review, ReviewComment],
  synchronize: true,
  autoLoadEntities: true,
  charset: 'utf8mb4',
  logging: true,
};
