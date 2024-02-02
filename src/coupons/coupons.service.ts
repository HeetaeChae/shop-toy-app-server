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
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon) private couponsRepository: Repository<Coupon>,
    @InjectRepository(UserCoupon)
    private userCouponRepository: Repository<UserCoupon>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  // 쿠폰 이름으로 가져오기
  async getCouponByName(name: string): Promise<Coupon | undefined> {
    return await this.couponsRepository.findOneBy({ name });
  }

  // 쿠폰 id로 가져오기
  async getCoponById(id: number): Promise<Coupon | undefined> {
    return await this.couponsRepository.findOne({ where: { id } });
  }

  // 모든 쿠폰 가져오기
  async getCoupons(): Promise<Coupon[] | undefined> {
    return await this.couponsRepository.find();
  }

  // 쿠폰 생성
  async createCoupon(
    name: string,
    discountAmount: number,
  ): Promise<Coupon | undefined> {
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

  // 쿠폰 사용가능 여부 상태 업데이트
  async updateCouponActivateStatus(couponId: number, isActive: IsActive) {
    // 쿠폰 업데이트 후 리턴
    const updatedCoupon = await this.couponsRepository.update(couponId, {
      isActive,
    });
    // 쿠폰 존재여부 확인
    if (updatedCoupon.affected === 0) {
      throw new NotFoundException('쿠폰이 존재하지 않습니다.');
    }
    return updatedCoupon;
  }

  // 쿠폰 삭제
  async deleteCoupon(couponId: number): Promise<void> {
    // 쿠폰 삭제
    const deletedCoupon = await this.couponsRepository.softDelete({
      id: couponId,
    });
    // 쿠폰 존재여부 확인
    if (deletedCoupon.affected === 0) {
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
    userId: number,
    couponId: number,
  ): Promise<UserCoupon | undefined> {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('존재하는 유저가 아닙니다.');
    }
    const coupon = await this.getCoponById(couponId);
    if (!coupon) {
      throw new NotFoundException('쿠폰이 존재하지 않습니다.');
    }
    // 쿠폰 생성후 리턴
    const newUserCoupon = await this.userCouponRepository.create({
      isUsed: IsUsed.NOTUSED,
      isActive: IsActive.ACTIVE,
      expiredAt: dayjs().add(7, 'days').toDate(),
      user,
      coupon,
    });
    return this.userCouponRepository.save(newUserCoupon);
  }

  async updateUserCouponUsageStatus(
    userId: number,
    couponId: number,
    isUsed: IsUsed,
  ) {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('존재하는 유저가 아닙니다.');
    }
    const coupon = await this.getCoponById(couponId);
    if (!coupon) {
      throw new NotFoundException('쿠폰이 존재하지 않습니다.');
    }
    const userCoupon = await this.userCouponRepository.findOne({
      where: { user, coupon },
    });
    if (!userCoupon) {
      throw new NotFoundException('쿠폰이 존재하지 않습니다.');
    }
    // 쿠폰 사용여부 업데이트 후 리턴
    userCoupon.isUsed = isUsed;
    return this.userCouponRepository.save(userCoupon);
  }
}
