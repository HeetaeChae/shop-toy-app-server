import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { IsPrimary } from 'src/enums/is-primary.enum';

export class CreateAddressDto {
  @ApiProperty({ example: '10880', description: '우편번호' })
  @IsString()
  zipCode: string;

  @ApiProperty({
    example: '경기도 파주시 초롱꽃로 130',
    description: '도로명 주소',
  })
  @IsString()
  streetAddress: string;

  @ApiProperty({ example: '우리집', description: '주소이름' })
  @IsString()
  @MaxLength(6)
  @MinLength(1)
  addressName: string;

  @ApiProperty({ example: '채희태', description: '수령인 이름' })
  @IsString()
  @MaxLength(6)
  @MinLength(1)
  receptorName: string;

  @ApiProperty({ example: '031-123-1234', description: '수령인 전화' })
  @IsString()
  receptorPhone: string;

  @ApiProperty({ example: '010-1234-1234', description: '수령인 휴대폰' })
  @IsString()
  receptorMobile: string;
}
