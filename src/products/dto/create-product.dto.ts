import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, MinLength } from 'class-validator';
import { Color } from 'src/enums/color.enum';
import { Gender } from 'src/enums/gender.enum';
import { Size } from 'src/enums/size.enum';

export class CreateProductDto {
  @ApiProperty({
    title: 'name',
    description: '상품명',
    example: '구제 반팔 상의',
    type: 'string',
    required: true,
  })
  @IsString()
  @MinLength(2, { message: '2글자 이상 입력해주세요.' })
  name: string;

  @ApiProperty({
    title: 'price',
    description: '상품가격',
    example: '58000',
    type: 'number',
    required: true,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    title: 'salesPrice',
    description: '판매가격',
    example: '40000',
    type: 'number',
    required: true,
  })
  @IsNumber()
  salesPrice: number;

  @ApiProperty({
    title: 'color',
    description: '색상',
    example: Color.BLACK,
    type: 'string',
    required: true,
  })
  @IsEnum(Color)
  color: Color;

  @ApiProperty({
    title: 'salesQuantity',
    description: '판매량',
    example: 0,
    type: 'number',
    required: true,
  })
  @IsNumber()
  salesQuantity: number;

  @ApiProperty({
    title: 'size',
    description: '사이즈',
    example: Size.FREE,
    type: 'string',
    required: true,
  })
  @IsEnum(Size)
  size: Size;

  @ApiProperty({
    title: 'gender',
    description: '성별',
    example: Gender.FEMALE,
    type: 'string',
    required: true,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    title: 'description',
    description: '설명',
    example: '빈티지한 느낌의 정품 조던 구제상품입니다.',
    type: 'string',
    required: false,
  })
  @IsString()
  description: string;
}
