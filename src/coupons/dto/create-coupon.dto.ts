import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ example: '웰컴쿠폰', description: '쿠폰이름' })
  @IsString()
  name: string;

  @ApiProperty({ example: 10, description: '할인율' })
  @IsNumber()
  discountAmount: number;
}
