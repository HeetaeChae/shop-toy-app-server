import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateSearchDto {
  @ApiProperty({
    example: '데님팬츠',
    description: '검색어',
    required: true,
    type: 'string',
  })
  @IsString()
  @MinLength(1, { message: '검색어를 1글자 이상 입력해주세요.' })
  keyword: string;
}
