import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, MaxLength } from 'class-validator';
import { Rating } from 'src/enums/rating.enum';

export class CreateReviewDto {
  @ApiProperty({ example: Rating.FIVE, description: '리뷰 평점' })
  @IsEnum(Rating)
  rating: Rating;

  @ApiProperty({ example: '상품 추천합니다.', description: '리뷰 내용' })
  @IsString()
  @MaxLength(300)
  content: string;

  @ApiProperty({ example: 23, description: '상품 id' })
  @IsNumber()
  productId: number;
}
