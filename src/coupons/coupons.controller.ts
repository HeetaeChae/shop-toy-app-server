import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/auth-status.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { IsAdminRoles } from 'src/decorators/is-admin-roles.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { CouponOrderBy, CouponOrderName } from 'src/enums/coupon-order.enum';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponStatusDto } from './dto/update-coupon-status.dto';
import { UpdateUserCouponStatusDto } from './dto/update-user-coupon-status.dto';

@Controller('coupons')
@ApiTags('coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  // 모든 쿠폰 가져오기
  @ApiOperation({
    summary: '모든 쿠폰 가져오기',
    description: '모든 쿠폰 가져오기 기능',
  })
  @Get()
  async getCoupons(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
    @Query('orderName') orderName: CouponOrderName = CouponOrderName.CREATED_AT,
    @Query('orderBy') orderBy: CouponOrderBy = CouponOrderBy.DESC,
  ) {
    return this.couponsService.getCoupons(page, pageSize, orderName, orderBy);
  }

  // 유저 모든쿠폰 가져오기
  @ApiOperation({
    summary: '모든 유저 쿠폰 가져오기',
    description: '모든 유저 쿠폰 가져오기 기능',
  })
  @UseGuards(LoggedInGuard)
  @Get('user-coupons')
  async getUserCoupons(
    @UserId() userId: number,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
    @Query('orderName') orderName: CouponOrderName = CouponOrderName.CREATED_AT,
    @Query('orderBy') orderBy: CouponOrderBy = CouponOrderBy.DESC,
  ) {
    return this.couponsService.getUserCoupons(
      userId,
      page,
      pageSize,
      orderName,
      orderBy,
    );
  }

  // 유저 쿠폰 가져오기
  @ApiOperation({
    summary: '특정 유저 쿠폰 가져오기',
    description: '특정 유저 쿠폰 가져오기 기능',
  })
  @UseGuards(LoggedInGuard)
  @Get(':id/user-coupons')
  async getUserCoupon(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) couponId: number,
  ) {
    return this.couponsService.getUserCoupon(userId, couponId);
  }

  // 쿠폰 생성
  @UseGuards(LoggedInGuard)
  @Post()
  @ApiOperation({ summary: '쿠폰 생성', description: '쿠폰 생성 기능' })
  async createCoupon(
    @IsAdminRoles() isAdminRoles: boolean,
    @Body(new ValidationPipe()) createCouponDto: CreateCouponDto,
  ) {
    if (!isAdminRoles) {
      throw new ForbiddenException('어드민 계정만 쿠폰을 생성할 수 있습니다.');
    }
    const { name, discountAmount } = createCouponDto;
    return this.couponsService.createCoupon(name, discountAmount);
  }

  // 쿠폰 삭제
  @ApiOperation({ summary: '쿠폰 삭제', description: '쿠폰 삭제 기능' })
  @UseGuards(LoggedInGuard)
  @Delete(':id')
  async deleteCoupon(
    @IsAdminRoles() isAdminRoles: boolean,
    @Param('id', ParseIntPipe) couponId: number,
  ) {
    if (!isAdminRoles) {
      throw new ForbiddenException('어드민 계정만 쿠폰을 삭제할 수 있습니다.');
    }
    return this.couponsService.deleteCoupon(couponId);
  }

  // 유저 쿠폰 생성
  @ApiOperation({
    summary: '유저 쿠폰 생성(등록)',
    description: '유저 쿠폰 생성(등록) 기능',
  })
  @UseGuards(AuthGuard)
  @Post(':id/user-coupons')
  async createUserCoupon(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) couponId: number,
  ) {
    return this.couponsService.createUserCoupon(userId, couponId);
  }

  // 유저 쿠폰 사용여부 변경
  @ApiOperation({
    summary: '유저 쿠폰 사용여부 변경',
    description: '유저 쿠폰 사용여부 변경 기능 (0: 미사용, 1: 사용)',
  })
  @UseGuards(AuthGuard)
  @Patch(':id/user-coupons')
  async updateUserCoupon(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) couponId: number,
    @Body() updateUserCouponStatusDto: UpdateUserCouponStatusDto,
  ) {
    const { isUsed } = updateUserCouponStatusDto;
    return this.couponsService.updateUserCouponUsageStatus(
      userId,
      couponId,
      isUsed,
    );
  }
}
