import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    example: '10880',
    description: '우편번호',
    required: true,
    type: 'string',
  })
  @IsString()
  zipCode: string;

  @ApiProperty({
    example: '경기도 파주시 초롱꽃로 130',
    description: '도로명 주소',
    required: true,
    type: 'string',
  })
  @IsString()
  streetAddress: string;

  @ApiProperty({
    example: '우리집',
    description: '주소이름',
    required: true,
    type: 'string',
  })
  @IsString()
  @MaxLength(6, { message: '주소지 이름을 6자 이하로 입력해주세요.' })
  @MinLength(1, { message: '주소지 이름을 1자 이상 입력해주세요.' })
  addressName: string;

  @ApiProperty({
    example: '채희태',
    description: '수령인 이름',
    required: true,
    type: 'string',
  })
  @IsString()
  @MaxLength(6, { message: '수령인 이름을 6자 이하로 입력해주세요.' })
  @MinLength(1, { message: '수령인 이름을 1자 이상 입력해주세요.' })
  receptorName: string;

  @ApiProperty({
    example: '0311231234',
    description: '수령인 전화',
    required: true,
    type: 'string',
  })
  @IsPhoneNumber('KR')
  receptorPhone: string;

  @ApiProperty({
    example: '01012341234',
    description: '수령인 휴대폰',
    required: true,
    type: 'string',
  })
  @IsPhoneNumber('KR')
  receptorMobile: string;
}
