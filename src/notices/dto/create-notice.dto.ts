import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { IsActive } from 'src/enums/is-active.enum';

export class CreateNoticeDto {
  @ApiProperty({
    example: '웰컴 할인 쿠폰 공지',
    description: '공지사항 제목',
    type: 'string',
    required: true,
  })
  @IsString()
  @MinLength(3, { message: '제목을 3글자 이상 입력하세요.' })
  title: string;

  @ApiProperty({
    example: '새로 가입하는 모든 유저에게 웰컴 할인 쿠폰을 발급해드립니다.',
    description: '공지사항 내용',
    type: 'string',
    required: true,
  })
  @IsString()
  @MinLength(3, { message: '3글자 이상 입력하세요.' })
  content: string;

  @ApiProperty({
    example: IsActive.ACTIVE,
    description: '공지사항 활성 여부 (0: 비활성 1: 활성)',
    type: 'number',
    required: true,
  })
  @IsEnum(IsActive)
  isActive: IsActive;
}
