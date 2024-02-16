import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from 'src/entities/Coupon.entity';
import { UserCoupon } from 'src/entities/UserCoupon.entity';
import { IsUsed } from 'src/enums/is-used.enum';
import { Repository, UpdateResult } from 'typeorm';
import * as dayjs from 'dayjs';
import { UsersService } from 'src/users/users.service';
import { CouponOrderBy, CouponOrderName } from 'src/enums/coupon-order.enum';

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
    const coupon = await this.couponsRepository.findOneBy({ name });
    if (!coupon) {
      throw new NotFoundException('쿠폰을 찾을 수 없습니다.');
    }
    return coupon;
  }

  // 쿠폰 id로 가져오기
  async getCoponById(id: number): Promise<Coupon | undefined> {
    const coupon = await this.couponsRepository.findOne({ where: { id } });
    if (!coupon) {
      throw new NotFoundException('쿠폰을 찾을 수 없습니다.');
    }
    return coupon;
  }

  async getUserCouponById(id: number): Promise<UserCoupon | undefined> {
    const userCoupon = await this.userCouponRepository.findOne({
      where: { id },
    });
    if (!userCoupon) {
      throw new NotFoundException('유저의 쿠폰을 찾을 수 없습니다.');
    }
    return userCoupon;
  }

  // 모든 쿠폰 가져오기
  async getCoupons(
    page: number,
    pageSize: number,
    orderName: CouponOrderName,
    orderBy: CouponOrderBy,
  ): Promise<Coupon[] | undefined> {
    return this.couponsRepository.find({
      order: { [orderName]: orderBy },
      skip: (page - 1) * pageSize,
      take: page * pageSize,
    });
  }

  // 쿠폰 생성
  async createCoupon(
    name: string,
    discountAmount: number,
    expiryPeriod: number,
  ): Promise<Coupon | undefined> {
    // 쿠폰 존재여부 확인
    const existingCoupon = await this.getCouponByName(name);
    if (existingCoupon) {
      throw new ConflictException('이미 존재하는 쿠폰이름입니다.');
    }
    // 쿠폰 생성후 리턴
    const newCoupon = await this.couponsRepository.create({
      name,
      discountAmount,
      expiryPeriod,
    });
    const savedCoupon = await this.couponsRepository.save(newCoupon);
    if (!savedCoupon) {
      throw new ForbiddenException('쿠폰을 생성할 수 없습니다.');
    }
    return savedCoupon;
  }

  // 쿠폰 삭제
  async deleteCoupon(couponId: number): Promise<UpdateResult | undefined> {
    // 쿠폰 삭제
    const deletedCoupon = await this.couponsRepository.softDelete({
      id: couponId,
    });
    // 쿠폰 존재여부 확인
    if (deletedCoupon.affected === 0) {
      throw new NotFoundException('쿠폰이 존재하지 않습니다.');
    }
    return deletedCoupon;
  }

  // 모든 유저 쿠폰 가져오기
  async getUserCoupons(
    userId: number,
    page: number,
    pageSize: number,
    orderName: CouponOrderName,
    orderBy: CouponOrderBy,
  ): Promise<Coupon[] | undefined> {
    return this.couponsRepository
      .createQueryBuilder('coupon')
      .innerJoin('coupon.userCoupons', 'userCoupons')
      .innerJoin('userCoupons.user', 'user')
      .where('user.id = :userId', { userId })
      .skip((page - 1) * pageSize)
      .take(page * pageSize)
      .orderBy(orderName, orderBy)
      .getMany();
  }

  // 특정 유저 쿠폰 가져오기
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

  // 유저쿠폰 생성
  async createUserCoupon(
    userId: number,
    couponId: number,
  ): Promise<UserCoupon | undefined> {
    const user = await this.usersService.getUserById(userId);
    const coupon = await this.getCoponById(couponId);
    const existingUserCoupon = await this.userCouponRepository.findOne({
      where: { user, coupon },
    });
    if (existingUserCoupon) {
      throw new ConflictException('동일한 쿠폰을 이미 발급받았습니다.');
    }
    // coupon의 expiryPeriod만큼의 일수를 현재시간에서 더한 날짜의 정오 1초 전 (23시 59분 59초)을 계산하는 방법
    const expiredAt = dayjs()
      .add(coupon.expiryPeriod, 'day')
      .endOf('day')
      .toDate();
    // 쿠폰 생성후 리턴
    const newUserCoupon = await this.userCouponRepository.create({
      isUsed: IsUsed.NOTUSED,
      expiredAt,
      user,
      coupon,
    });
    return this.userCouponRepository.save(newUserCoupon);
  }

  // 유저쿠폰 사용여부 변경
  async updateUserCouponUsageStatus(
    userId: number,
    couponId: number,
    isUsed: IsUsed,
  ): Promise<UpdateResult | undefined> {
    const user = await this.usersService.getUserById(userId);
    const coupon = await this.getCoponById(couponId);
    const userCoupon = await this.userCouponRepository.findOne({
      where: { user, coupon },
    });
    if (!userCoupon) {
      throw new NotFoundException('쿠폰이 존재하지 않습니다.');
    }
    const updatedUserCoupon = await this.userCouponRepository.update(
      userCoupon.id,
      { isUsed },
    );
    if (updatedUserCoupon.affected === 0) {
      throw new ForbiddenException('쿠폰 사용 여부를 변경할 수 없습니다.');
    }
    return updatedUserCoupon;
  }
}
