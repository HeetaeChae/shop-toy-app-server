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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/auth-status.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { IsAdminRoles } from 'src/decorators/is-admin-roles.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
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
  async getCoupons() {
    return this.couponsService.getCoupons();
  }

  // 유저 모든쿠폰 가져오기
  @ApiOperation({
    summary: '모든 유저 쿠폰 가져오기',
    description: '모든 유저 쿠폰 가져오기 기능',
  })
  @UseGuards(LoggedInGuard)
  @Get('user-coupons')
  async getUserCoupons(@UserId() id: number) {
    return this.couponsService.getUserCoupons(id);
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

  // 쿠폰 사용가능 여부 변경
  @UseGuards(LoggedInGuard)
  @ApiOperation({
    summary: '쿠폰 사용가능 여부 변경',
    description: '쿠폰 사용가능 여부 변경 기능 (0: 비활성, 1: 활성)',
  })
  @Patch(':id')
  async updateCoupon(
    @IsAdminRoles() isAdminRoles: boolean,
    @Param('id', ParseIntPipe) couponId: number,
    @Body() updateCouponStatusDto: UpdateCouponStatusDto,
  ) {
    if (!isAdminRoles) {
      throw new ForbiddenException(
        '어드민 계정만 쿠폰 사용가능 여부를 변경할 수 있습니다.',
      );
    }
    const { isActive } = updateCouponStatusDto;
    return this.couponsService.updateCouponActivateStatus(couponId, isActive);
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
