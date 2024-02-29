import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({
    example: '웰컴쿠폰',
    description: '쿠폰이름',
    required: true,
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 10,
    description: '할인율',
    required: true,
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  discountAmount: number;

  @ApiProperty({
    example: 7,
    description: '유효기간 (일 수)',
    required: true,
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  expiryPeriod: number;
}
