import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'src/enums/roles.enum';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({
    example: 'john@email.com',
    description: '유저 이메일 주소',
    required: true,
    type: 'string',
  })
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: '유저 패스워드',
    required: true,
    type: 'string',
  })
  @IsString()
  @MinLength(3, { message: '비밀번호를 3자 이상 입력하세요.' })
  @MaxLength(12, { message: '비밀번호를 12자 이하로 입력하세요.' })
  password: string;

  @ApiProperty({
    example: 'john',
    description: '유저 닉네임',
    required: true,
    type: 'string',
  })
  @IsString()
  @MinLength(3, { message: '닉네임을 3자 이상 입력하세요.' })
  @MaxLength(6, { message: '닉네임을 6자 이하로 입력하세요.' })
  nickname: string;

  @ApiProperty({
    example: 3,
    description: '유저 역할 (1: 어드민, 2: 판매자, 3: 일반 회원)',
    required: true,
    type: 'string',
  })
  @IsEnum(Roles)
  roles: Roles;
}
