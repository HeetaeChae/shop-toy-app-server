import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/Product.entity';
import { Color } from 'src/enums/color.enum';
import { Gender } from 'src/enums/gender.enum';
import { ProductOrderBy, ProductOrderName } from 'src/enums/product-order.enum';
import { Size } from 'src/enums/size.enum';
import { UsersService } from 'src/users/users.service';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { CreateProductImgUrlDto } from './dto/create-product-img-url.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async getProductById(productId: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }
    return product;
  }

  async checkIsExistProductName(productName: string) {
    const product = await this.productsRepository.findOne({
      where: { name: productName },
    });
    if (product) {
      throw new ConflictException('이미 존재하는 상품명입니다.');
    }
  }

  async getProducts(
    page: number,
    pageSize: number,
    orderName: ProductOrderName,
    orderBy: ProductOrderBy,
    userId?: number,
    categoryId?: number,
    filters?: {
      color?: Color;
      size?: Size;
      gender?: Gender;
      minPrice?: number;
      maxPrice?: number;
    },
    searchedName?: string,
  ) {
    let query: any = {};
    if (userId) {
      const user = await this.usersService.getUserById(userId);
      query.user = user;
    }
    if (categoryId) {
      // user와 같은 방법
    }
    if (filters?.color) {
      query.color = filters.color;
    }
    if (filters?.size) {
      query.size = filters.size;
    }
    if (filters?.gender) {
      query.gender = filters.gender;
    }
    if (filters?.minPrice) {
      query.price = MoreThan(filters.minPrice);
    }
    if (filters?.maxPrice) {
      query.price = LessThan(filters.maxPrice);
    }
    return this.productsRepository.find({
      where: query,
      order: { [orderName]: orderBy },
      take: page * pageSize,
      skip: (page - 1) * pageSize,
    });
  }

  async createProduct(userId: number, createProductDto: CreateProductDto) {
    const productName = createProductDto.name;
    await this.checkIsExistProductName(productName);
    const user = await this.usersService.getUserById(userId);
    const newProduct = await this.productsRepository.create({
      user,
      ...createProductDto,
    });
  }
}
