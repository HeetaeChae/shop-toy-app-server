import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSearchDto {
  @ApiProperty({ example: '데님팬츠', description: '검색어' })
  @IsString()
  keyword: string;
}
