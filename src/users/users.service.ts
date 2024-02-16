import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartsService } from 'src/carts/carts.service';
import { CouponsService } from 'src/coupons/coupons.service';
import { User } from 'src/entities/User.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { DataSource, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(forwardRef(() => WishesService))
    private wishesService: WishesService,
    @Inject(forwardRef(() => CartsService))
    private cartsService: CartsService,
    @Inject(forwardRef(() => CouponsService))
    private couponsService: CouponsService,
    private dataSource: DataSource,
  ) {}

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('존재하는 유저가 아닙니다.');
    }
    return user;
  }

  async getUserByNickname(nickname: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { nickname } });
    if (!user) {
      throw new NotFoundException('존재하는 유저가 아닙니다.');
    }
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('존재하는 유저가 아닙니다.');
    }
    return user;
  }

  async createUser(
    email: string,
    password: string,
    nickname: string,
    roles: number,
  ): Promise<User | undefined> {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
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
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async deleteUserById(id: number): Promise<UpdateResult | undefined> {
    const deletedUser = await this.userRepository.softDelete({ id });
    if (deletedUser.affected === 0) {
      throw new ForbiddenException('유저를 삭제하지 못했습니다.');
    }
    return deletedUser;
  }
}
