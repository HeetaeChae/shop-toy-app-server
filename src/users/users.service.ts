import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Cart } from 'src/entities/Cart.entity';
import { Coupon } from 'src/entities/Coupon.entity';
import { User } from 'src/entities/User.entity';
import { UserCoupon } from 'src/entities/UserCoupon.entity';
import { Wish } from 'src/entities/Wish.entity';
import { CouponName } from 'src/enums/coupon-name.enum';
import { Roles } from 'src/enums/roles.enum';
import { DataSource, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private dataSource: DataSource,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(UserCoupon)
    private userCouponRepository: Repository<UserCoupon>,
  ) {}

  async checkIsExistingEmail(email: string): Promise<void | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
  }

  async checkIsExistingNickname(nickname: string): Promise<void | undefined> {
    const user = await this.userRepository.findOne({ where: { nickname } });
    if (user) {
      throw new ConflictException('이미 존재하는 닉네임입니다.');
    }
  }

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
    roles: Roles,
  ): Promise<User | undefined> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // 유저 생성
      const newUser = this.userRepository.create({
        email,
        password,
        nickname,
        roles,
      });
      const savedUser = await queryRunner.manager.save(newUser);

      // 찜 생성
      const newWish = this.wishRepository.create({ user: savedUser });
      await queryRunner.manager.save(newWish);

      // 장바구니 생성
      const newCart = this.cartRepository.create({ user: savedUser });
      await queryRunner.manager.save(newCart);

      // 발급쿠폰 생성
      const welcomeCoupon = await queryRunner.manager
        .createQueryBuilder(Coupon, 'coupon')
        .where('coupon.name = :couponName', {
          couponName: CouponName.WELCOME_COUPON,
        })
        .getOneOrFail();
      const newUserCoupon = this.userCouponRepository.create({
        user: savedUser,
        coupon: welcomeCoupon,
      });
      await queryRunner.manager.save(newUserCoupon);

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
