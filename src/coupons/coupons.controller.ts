import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserPayloadDto } from 'src/auth/dto/user-payload.dto';
import { UserPayload } from 'src/decorators/user-payload.decorator';
import { IsUsed } from 'src/enums/is-used.enum';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponStatusDto } from './dto/update-coupon-status.dto';

@Controller('coupons')
@ApiTags('coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Get()
  @ApiOperation({
    summary: '모든 쿠폰 가져오기',
    description: '모든 쿠폰 가져오기 기능',
  })
  async getCoupons() {
    return this.couponsService.getCoupons();
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: '쿠폰 생성', description: '쿠폰 생성 기능' })
  async createCoupon(
    @UserPayload() userPayloadDto: UserPayloadDto,
    @Body(new ValidationPipe()) createCouponDto: CreateCouponDto,
  ) {
    const { roles } = userPayloadDto;
    const { name, discountAmount } = createCouponDto;
    return this.couponsService.createCoupon(name, discountAmount, roles);
  }

  @UseGuards(AuthGuard)
  @Patch(':couponId')
  @ApiOperation({
    summary: '쿠폰 사용가능 여부 변경',
    description: '쿠폰 사용가능 여부 변경 기능 (0: 비활성, 1: 활성)',
  })
  async updateCoupon(
    @UserPayload() userPayloadDto: UserPayloadDto,
    @Param('couponId', ParseIntPipe) couponId: number,
    @Body() updateCouponStatusDto: UpdateCouponStatusDto,
  ) {
    const { roles } = userPayloadDto;
    const { isActive } = updateCouponStatusDto;
    return this.couponsService.updateCouponActivateStatus(
      roles,
      couponId,
      isActive,
    );
  }

  // 쿠폰 삭제
  @UseGuards(AuthGuard)
  @Delete(':couponId')
  @ApiOperation({ summary: '쿠폰 삭제', description: '쿠폰 삭제 기능' })
  async deleteCoupon(
    @UserPayload() userPayloadDto: UserPayloadDto,
    @Param('couponId', ParseIntPipe) couponId: number,
  ) {
    const { roles } = userPayloadDto;
    return this.couponsService.deleteCoupon(couponId, roles);
  }

  // 모든 유저 쿠폰 가져오기
  @UseGuards(AuthGuard)
  @Get('user-coupons')
  @ApiOperation({
    summary: '모든 유저 쿠폰 가져오기',
    description: '모든 유저 쿠폰 가져오기 기능',
  })
  async getUserCoupons(@UserPayload() userPayloadDto: UserPayloadDto) {
    const userId = userPayloadDto.id;
    return this.couponsService.getUserCoupons(userId);
  }

  // 특정 유저 쿠폰 가져오기
  @UseGuards(AuthGuard)
  @Get(':userCouponId/user-coupons')
  @ApiOperation({
    summary: '특정 유저 쿠폰 가져오기',
    description: '특정 유저 쿠폰 가져오기 기능',
  })
  async getUserCoupon(
    @UserPayload() userPayloadDto: UserPayloadDto,
    @Param('userCouponId', ParseIntPipe) userCouponId: number,
  ) {
    const userId = userPayloadDto.id;
    return this.couponsService.getUserCoupon(userId, userCouponId);
  }

  // 유저 쿠폰 생성
  @UseGuards(AuthGuard)
  @Post(':couponId/user-coupons')
  @ApiOperation({
    summary: '유저 쿠폰 생성(등록)',
    description: '유저 쿠폰 생성(등록) 기능',
  })
  async createUserCoupon(
    @UserPayload() userPayloadDto: UserPayloadDto,
    @Param('couponId', ParseIntPipe) couponId: number,
  ) {
    const userId = userPayloadDto.id;
    return this.couponsService.createUserCouponByUserIdAndCouponId(
      userId,
      couponId,
    );
  }

  // 유저 쿠폰 사용여부 변경
  @UseGuards(AuthGuard)
  @Patch(':userCouponId/user-coupons')
  @ApiOperation({
    summary: '유저 쿠폰 사용여부 변경',
    description: '유저 쿠폰 사용여부 변경 기능 (0: 미사용, 1: 사용)',
  })
  async updateUserCoupon(
    @UserPayload() userPayloadDto: UserPayloadDto,
    @Param('userCouponId', ParseIntPipe) userCouponId: number,
    @Body() isUsed: IsUsed,
  ) {
    const userId = userPayloadDto.id;
    return this.couponsService.updateUserCouponUsageStatus(
      userId,
      userCouponId,
      isUsed,
    );
  }
}
