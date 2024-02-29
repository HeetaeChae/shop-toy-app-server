import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';
import { UpdateUserCouponStatusDto } from './update-user-coupon-status.dto';

export class CreateUserCouponDto {
  @ApiProperty({
    example: 55,
    description: '쿠폰 id',
    required: true,
    type: 'number',
  })
  @IsNumber()
  couponId: number;
}
