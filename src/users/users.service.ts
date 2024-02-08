import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartsService } from 'src/carts/carts.service';
import { CouponsService } from 'src/coupons/coupons.service';
import { User } from 'src/entities/User.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(forwardRef(() => WishesService))
    private wishesService: WishesService,
    private cartsService: CartsService,
    @Inject(forwardRef(() => CouponsService))
    private couponsService: CouponsService,
    private dataSource: DataSource,
  ) {}

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserByNickname(nickname: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { nickname } });
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(
    email: string,
    password: string,
    nickname: string,
    roles: number,
  ): Promise<User | undefined> {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      // 유저 생성
      const newUser = await this.userRepository.create({
        email,
        password,
        nickname,
        roles,
      });
      const savedUser = await this.userRepository.save(newUser);
      // 찜 생성
      await this.wishesService.createWish(savedUser);
      // 장바구니 생성
      await this.cartsService.creatCart(savedUser);
      await queryRunner.commitTransaction();
      return savedUser;
      // 유저 리턴 ?
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async deleteUserById(id: number) {
    return this.userRepository.softDelete({ id });
  }
}
