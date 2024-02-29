import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
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

  async checkIsExistingCouponName(name: string) {
    const coupon = await this.couponsRepository.findOne({ where: { name } });
    if (coupon) {
      throw new ConflictException('이미 존재하는 쿠폰 이름입니다.');
    }
  }

  async checkIsExistingUserCoupon(
    userId: number,
    couponId: number,
  ): Promise<void | undefined> {
    const userCoupon = await this.userCouponRepository.findOne({
      where: { user: { id: userId }, coupon: { id: couponId } },
    });
    if (userCoupon) {
      throw new ConflictException('이미 해당 쿠폰을 보유하고 있습니다.');
    }
  }

  // 모든 쿠폰 가져오기
  async getCoupons(
    userId: number,
    page: number,
    pageSize: number,
    orderName: CouponOrderName,
    orderBy: CouponOrderBy,
  ): Promise<Coupon[] | undefined> {
    return this.couponsRepository
      .createQueryBuilder('coupon')
      .leftJoinAndSelect(
        'coupon.userCoupons',
        'userCoupons',
        'userCoupons.user.id = :userId',
        { userId },
      )
      .orderBy(`coupon.${orderName}`, orderBy)
      .skip((page - 1) * pageSize)
      .take(page * pageSize)
      .getMany();
  }

  // 쿠폰 생성
  async createCoupon(
    name: string,
    discountAmount: number,
    expiryPeriod: number,
  ): Promise<Coupon | undefined> {
    // 쿠폰 존재여부 확인
    await this.checkIsExistingCouponName(name);
    // 쿠폰 생성후 리턴
    const newCoupon = this.couponsRepository.create({
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
  ): Promise<UserCoupon[] | undefined> {
    return this.userCouponRepository
      .createQueryBuilder('userCoupons')
      .innerJoin('userCoupons.user', 'user')
      .leftJoinAndSelect('userCoupons.coupon', 'coupon')
      .where('user.id = :userId', { userId })
      .skip((page - 1) * pageSize)
      .take(page * pageSize)
      .orderBy(`coupon.${orderName}`, orderBy)
      .getMany();
  }

  // 특정 유저 쿠폰 가져오기
  async getUserCoupon(userId: number, couponId: number) {
    const userCoupon = await this.userCouponRepository
      .createQueryBuilder('userCoupons')
      .innerJoin('userCoupons.user', 'user')
      .leftJoinAndSelect('userCoupons.coupon', 'coupon')
      .where('user.id = :userId', { userId })
      .andWhere('coupon.id = :couponId', { couponId })
      .getOne();
    if (!userCoupon) {
      throw new ForbiddenException('유저 쿠폰이 존재하지 않습니다.');
    }
    return userCoupon;
  }

  // 유저쿠폰 생성
  async createUserCoupon(
    userId: number,
    couponId: number,
  ): Promise<UserCoupon | undefined> {
    await this.checkIsExistingUserCoupon(userId, couponId);
    const user = await this.usersService.getUserById(userId);
    const coupon = await this.getCoponById(couponId);
    // coupon의 expiryPeriod만큼의 일수를 현재시간에서 더한 날짜의 정오
    const expiredAt = dayjs()
      .add(coupon.expiryPeriod, 'day')
      .endOf('day')
      .toDate();
    // 쿠폰 생성후 리턴
    const newUserCoupon = this.userCouponRepository.create({
      isUsed: IsUsed.NOT_USED,
      expiredAt,
      user,
      coupon,
    });
    const savedUserCoupon = this.userCouponRepository.save(newUserCoupon);
    if (!savedUserCoupon) {
      throw new ForbiddenException('유저 쿠폰을 생성할 수 없습니다.');
    }
    return savedUserCoupon;
  }

  // 유저쿠폰 사용여부 변경
  async updateUserCouponUsageStatus(
    userId: number,
    couponId: number,
    isUsed: IsUsed,
  ): Promise<UpdateResult | undefined> {
    const userCoupon = await this.getUserCoupon(userId, couponId);
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
