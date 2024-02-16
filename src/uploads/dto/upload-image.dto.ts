import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadImageDto {
  @ApiProperty({
    title: '이미지 업로드',
    description: '업로드할 이미지 파일',
    format: 'binary',
  })
  file: any;
}
