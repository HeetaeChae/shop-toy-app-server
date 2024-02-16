import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateWishProductDto {
  @ApiProperty({ example: 55, description: '찜할 상품 id' })
  @IsNumber()
  productId: number;
}
