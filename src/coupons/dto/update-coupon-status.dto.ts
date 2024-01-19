import { ApiProperty } from '@nestjs/swagger';
import { IsActive } from 'src/enums/is-active.enum';

export class UpdateCouponStatusDto {
  @ApiProperty({
    example: 0,
    description: '사용가능 여부 (0: 사용 불가능, 1: 사용가능)',
  })
  isActive: IsActive;
}
