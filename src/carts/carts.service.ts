import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/entities/Cart.entity';
import { CartProduct } from 'src/entities/CartProduct.entity';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartProduct)
    private cartProductRepository: Repository<CartProduct>,
  ) {}

  async creatCart(user: User): Promise<Cart | undefined> {
    const newCart = await this.cartRepository.create({
      user: user,
    });
    return this.cartRepository.save(newCart);
  }
}
