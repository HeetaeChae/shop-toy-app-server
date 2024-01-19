import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'src/enums/roles.enum';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'john@email.com', description: '유저 이메일 주소' })
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty({ example: 'password123', description: '유저 패스워드' })
  @IsString()
  @MinLength(6, { message: '6자 이상 입력하세요.' })
  @MaxLength(12, { message: '12자 이하로 입력하세요.' })
  password: string;

  @ApiProperty({ example: 'john', description: '유저 닉네임' })
  @IsString()
  @MinLength(1, { message: '1자 이상 입력하세요.' })
  @MaxLength(6, { message: '6자 이하로 입력하세요.' })
  nickname: string;

  @ApiProperty({
    example: 3,
    description: '유저 역할 (1: 어드민, 2: 판매자, 3: 일반 회원)',
  })
  roles: Roles;
}
