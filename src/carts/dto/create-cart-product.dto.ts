import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { Color } from 'src/enums/color.enum';
import { Size } from 'src/enums/size.enum';

export class CreateCartProductDto {
  @ApiProperty({ example: 61, description: '상품 id' })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 1, description: '수량' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'white', description: '색상' })
  @IsEnum(Color)
  color: Color;

  @ApiProperty({ example: 'L', description: '사이즈' })
  @IsEnum(Size)
  size: Size;
}
