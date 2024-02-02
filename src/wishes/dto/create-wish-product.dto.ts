import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateWishProductDto {
  @ApiProperty({ example: 32, description: '찜 id' })
  @IsNumber()
  wishId: number;

  @ApiProperty({ example: 55, description: '찜할 상품 id' })
  @IsNumber()
  productId: number;
}
