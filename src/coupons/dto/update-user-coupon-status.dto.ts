import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { IsUsed } from 'src/enums/is-used.enum';

export class UpdateUserCouponStatusDto {
  @ApiProperty({
    example: IsUsed.USED,
    description: '유저의 쿠폰 사용여부 (0: 미사용, 1: 사용)',
    required: true,
    type: 'string',
  })
  @IsEnum(IsUsed)
  isUsed: IsUsed;
}
