import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Address } from 'src/entities/Address.entity';
import { BoughtProduct } from 'src/entities/BoughtProduct.entity';
import { Cart } from 'src/entities/Cart.entity';
import { CartProduct } from 'src/entities/CartProduct.entity';
import { Category } from 'src/entities/Category.entity';
import { Coupon } from 'src/entities/Coupon.entity';
import { Inquiry } from 'src/entities/Inquiry.entity';
import { InquiryComment } from 'src/entities/InquiryComment.entity';
import { Notice } from 'src/entities/Notice.entity';
import { Order } from 'src/entities/Order.entity';
import { OrderProduct } from 'src/entities/OrderProduct.entity';
import { Product } from 'src/entities/Product.entity';
import { RecentlyViewedProduct } from 'src/entities/RecentlyViewedProduct.entity';
import { Review } from 'src/entities/Review.entity';
import { ReviewComment } from 'src/entities/ReviewComment.entity';
import { ReviewThumbsup } from 'src/entities/ReviewThumbsup.entity';
import { Search } from 'src/entities/Search.entity';
import { Tag } from 'src/entities/Tag.entity';
import { TagProduct } from 'src/entities/TagProduct.entity';
import { User } from 'src/entities/User.entity';
import { UserCoupon } from 'src/entities/UserCoupon.entity';
import { Wish } from 'src/entities/Wish.entity';
import { WishProduct } from 'src/entities/WishProduct.entity';

dotenv.config();
export const ormconfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    User,
    Notice,
    Cart,
    CartProduct,
    Product,
    Review,
    ReviewComment,
    Address,
    Coupon,
    Inquiry,
    InquiryComment,
    Order,
    OrderProduct,
    RecentlyViewedProduct,
    Search,
    Tag,
    UserCoupon,
    Wish,
    Category,
    ReviewThumbsup,
    TagProduct,
    WishProduct,
    BoughtProduct,
  ],
  synchronize: false,
  autoLoadEntities: true,
  charset: 'utf8mb4',
  logging: true,
};
