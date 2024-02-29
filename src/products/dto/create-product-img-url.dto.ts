import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProductImgUrlDto {
  @ApiProperty({
    title: 'imgUrl1',
    description: '이미지주소1',
    type: 'string',
    required: true,
  })
  @IsString()
  imgUrl1: string;

  @ApiProperty({
    title: 'imgUrl2',
    description: '이미지주소2',
    type: 'string',
    required: false,
  })
  @IsString()
  imgUrl2: string;

  @ApiProperty({
    title: 'imgUrl3',
    description: '이미지주소3',
    type: 'string',
    required: false,
  })
  @IsString()
  imgUrl3: string;

  @ApiProperty({
    title: 'imgUrl4',
    description: '이미지주소4',
    type: 'string',
    required: false,
  })
  @IsString()
  imgUrl4: string;

  @ApiProperty({
    title: 'imgUrl5',
    description: '이미지주소5',
    type: 'string',
    required: false,
  })
  @IsString()
  imgUrl5: string;
}
