import { ApiProperty } from '@nestjs/swagger';
import { IsUsed } from 'src/enums/is-used.enum';

export class UpdateUserCouponStatusDto {
  @ApiProperty({
    example: 1,
    description: '유저의 쿠폰 사용여부 (0: 미사용, 1: 사용)',
  })
  isUsed: IsUsed;
}
