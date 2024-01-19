import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from 'src/entities/Coupon.entity';
import { UserCoupon } from 'src/entities/UserCoupon.entity';
import { IsActive } from 'src/enums/is-active.enum';
import { IsUsed } from 'src/enums/is-used.enum';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { User } from 'src/entities/User.entity';
import { UsersService } from 'src/users/users.service';
import { Roles } from 'src/enums/roles.enum';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon) private couponsRepository: Repository<Coupon>,
    @InjectRepository(UserCoupon)
    private userCouponRepository: Repository<UserCoupon>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async getCouponByName(name: string): Promise<Coupon | undefined> {
    // 쿠폰 찾아 리턴
    return await this.couponsRepository.findOneBy({ name });
  }

  async getCoponById(id: number): Promise<Coupon | undefined> {
    // 쿠폰 찾아 리턴
    return await this.couponsRepository.findOne({ where: { id } });
  }

  async getCoupons(): Promise<Coupon[] | undefined> {
    // 모든 쿠폰 리턴
    return await this.couponsRepository.find();
  }

  async createCoupon(
    name: string,
    discountAmount: number,
    userRoles: number,
  ): Promise<Coupon | undefined> {
    // 어드민 계정 확인
    if (userRoles !== Roles.ADMIN) {
      throw new UnauthorizedException(
        '쿠폰은 어드민계정만 발행할 수 있습니다.',
      );
    }
    // 쿠폰 존재여부 확인
    const existingCoupon = await this.getCouponByName(name);
    if (existingCoupon) {
      throw new ConflictException('이미 존재하는 쿠폰이름입니다.');
    }
    // 쿠폰 생성후 리턴
    const newCoupon = await this.couponsRepository.create({
      name: name,
      discountAmount: discountAmount,
      isActive: IsActive.ACTIVE,
    });
    return this.couponsRepository.save(newCoupon);
  }

  async updateCouponActivateStatus(
    roles: number,
    couponId: number,
    isActive: IsActive,
  ) {
    // 어드민 계정 확인
    if (roles !== Roles.ADMIN) {
      throw new UnauthorizedException(
        '쿠폰의 사용가능 여부는 어드민만 변경할 수 있습니다.',
      );
    }
    // 쿠폰 업데이트 후 리턴
    const result = await this.couponsRepository.update(couponId, { isActive });
    // 쿠폰 존재여부 확인
    if (result.affected === 0) {
      throw new NotFoundException('쿠폰이 존재하지 않습니다.');
    }
    return result;
  }

  async deleteCoupon(roles: number, couponId: number): Promise<void> {
    // 어드민 계정 확인
    if (roles !== Roles.ADMIN) {
      throw new UnauthorizedException(
        '쿠폰의 사용가능 여부는 어드민만 변경할 수 있습니다.',
      );
    }
    // 쿠폰 소프트삭제
    const result = await this.couponsRepository.softDelete({ id: couponId });
    // 쿠폰 존재여부 확인
    if (result.affected === 0) {
      throw new NotFoundException('쿠폰이 존재하지 않습니다.');
    }
  }

  async getUserCouponById(id: number) {
    return this.userCouponRepository.findOne({ where: { id } });
  }

  async getUserCoupons(userId: number) {
    const user = await this.usersService.getUserById(userId);
    const userCoupons = await this.userCouponRepository.findBy({ user });
    return userCoupons;
  }

  async getUserCoupon(userId: number, userCouponId: number) {
    const user = await this.usersService.getUserById(userId);
    const userCoupon = await this.userCouponRepository.findOne({
      where: { id: userCouponId },
    });
    if (user !== userCoupon.user) {
      throw new UnauthorizedException('쿠폰의 소유자가 아닙니다.');
    }
    return userCoupon;
  }

  async createUserCoupon(
    user: User,
    coupon: Coupon,
  ): Promise<UserCoupon | undefined> {
    // 쿠폰 생성후 리턴
    return this.userCouponRepository.create({
      isUsed: IsUsed.NOTUSED,
      isActive: IsActive.ACTIVE,
      expiredAt: dayjs().add(7, 'days').toDate(),
      user: user,
      coupon: coupon,
    });
  }

  async createUserCouponByUserIdAndCouponId(userId: number, couponId: number) {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('사용자가 존재하지 않습니다.');
    }
    const coupon = await this.getCoponById(couponId);
    if (!coupon) {
      throw new NotFoundException('쿠폰이 존재하지 않습니다.');
    }
    const newUserCoupon = await this.createUserCoupon(user, coupon);
    return this.userCouponRepository.save(newUserCoupon);
  }

  async updateUserCouponUsageStatus(
    userId: number,
    userCouponId: number,
    isUsed: IsUsed,
  ) {
    // 쿠폰 소유 여부 확인
    const coupon = await this.getUserCouponById(userCouponId);
    if (userId !== coupon.user.id) {
      throw new UnauthorizedException('쿠폰의 소유자가 아닙니다.');
    }
    // 쿠폰 사용여부 업데이트 후 리턴
    const result = await this.userCouponRepository.update(userCouponId, {
      isUsed,
    });
    // 쿠폰 존재여부 확인
    if (result.affected === 0) {
      throw new NotFoundException('쿠폰이 존재하지 않습니다.');
    }
    return result;
  }
}
