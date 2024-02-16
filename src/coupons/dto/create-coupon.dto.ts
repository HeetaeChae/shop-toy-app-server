import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ example: '웰컴쿠폰', description: '쿠폰이름' })
  @IsString()
  name: string;

  @ApiProperty({ example: 10, description: '할인율' })
  @IsNumber()
  discountAmount: number;

  @ApiProperty({ example: 7, description: '유효기간 (일 수)' })
  @IsNumber()
  expiryPeriod: number;
}
