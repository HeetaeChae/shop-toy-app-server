import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { IsPrimary } from 'src/enums/is-primary.enum';

export class UpdateAddressStatusDto {
  @ApiProperty({ example: 1, description: '대표 주소지 여부 업데이트' })
  @IsEnum(IsPrimary)
  isPrimary: IsPrimary;
}
