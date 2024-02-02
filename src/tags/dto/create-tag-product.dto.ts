import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateTagProductDto {
  @ApiProperty({ example: '겨울상품', description: '태그 이름' })
  @IsString()
  tagName: string;

  @ApiProperty({ example: 1, description: '상품 id' })
  @IsNumber()
  productId: number;
}
