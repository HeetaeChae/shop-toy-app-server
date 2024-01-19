import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { Wish } from 'src/entities/Wish.entity';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  async createWish(user: User): Promise<Wish | undefined> {
    const newWish = this.wishRepository.create({
      user,
    });
    return this.wishRepository.save(newWish);
  }

  async getWishById(wishId: number) {
    return this.wishRepository.findOne({ where: { id: wishId } });
  }

  async getWishWithProductsById(user: User, wishId: number) {
    return this.wishRepository.findOne({
      where: { user, id: wishId },
      relations: { products: true },
    });
  }

  async getWishProducts(userId: number): Promise<Wish | undefined> {
    const user = await this.usersService.getUserById(userId);
    const wish = await this.wishRepository.findOne({
      where: { user },
      relations: { products: true },
    });
    if (!wish || !user) {
      throw new NotFoundException('존재하지 않는 데이터입니다.');
    }
    return wish;
  }

  async createWishProduct(
    userId: number,
    wishId: number,
    productId: number,
  ): Promise<Wish | undefined> {
    const user = await this.usersService.getUserById(userId);
    const wish = await this.getWishWithProductsById(user, wishId);
    const product = await this.productsService.getProductById(productId);
    if (!wish || !product || !user) {
      throw new NotFoundException('존재하지 않는 데이터입니다.');
    }
    wish.products.push(product);
    return this.wishRepository.save(wish);
  }

  async deleteWishProducts(userId: number, wishId: number): Promise<void> {
    const user = await this.usersService.getUserById(userId);
    const wish = await this.getWishWithProductsById(user, wishId);
    if (!wish || !user) {
      throw new NotFoundException('존재하지 않는 데이터입니다.');
    }
    wish.products = [];
    await this.wishRepository.save(wish);
  }

  async deleteWishProduct(
    userId: number,
    wishId: number,
    productId: number,
  ): Promise<void> {
    const user = await this.usersService.getUserById(userId);
    const wish = await this.getWishWithProductsById(user, wishId);
    const product = await this.productsService.getProductById(productId);
    if (!wish || !product || !user) {
      throw new NotFoundException('존재하지 않는 데이터입니다.');
    }
    wish.products.filter((product) => product.id !== productId);
    await this.wishRepository.save(wish);
  }
}
