import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateRecentlyViewedProductDto {
  @ApiProperty({ example: 15, description: '상품 id' })
  @IsNumber()
  productId: number;
}
