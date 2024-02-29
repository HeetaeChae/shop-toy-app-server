import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v1 as uuid } from 'uuid';

@Injectable()
export class UploadsService {
  s3Client: S3Client;
  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadImageToS3(
    fileName: string,
    file: Express.Multer.File,
    ext: string,
  ): Promise<string | undefined> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: `image/${ext}`,
    });
    await this.s3Client.send(command);
    return `http://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`;
  }

  async getImageUrl(file: Express.Multer.File): Promise<string | undefined> {
    const imageName = uuid();
    const ext = file.originalname.split('.').pop();
    const imageUrl = await this.uploadImageToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );
    if (!imageUrl) {
      throw new ForbiddenException('이미지를 업로드하지 못했습니다.');
    }
    return imageUrl;
  }
}
