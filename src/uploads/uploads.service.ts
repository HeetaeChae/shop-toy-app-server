import { Injectable, Post, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadsService {
  private readonly s3;

  constructor(private configService: ConfigService) {
    configService = this.configService;
    AWS.config.update({
      region: configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: configService.get('AWS_SECRET_KEY'),
      },
    });
    this.s3 = new AWS.S3();
  }

  async uploadImage(files: Express.Multer.File[]) {
    const uploadedImage = await Promise.all(
      files.map(async (file) => {
        const key = `${Date.now() + file.originalname}`;
        const params = {
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          ACL: this.configService.get('AWS_ACL'),
          Key: key,
          Body: file.buffer,
        };
        return new Promise((resolve, reject) => {
          this.s3.putObject(params, (err, data) => {
            if (err) reject(err);
            resolve(key);
          });
        });
      }),
    );
    return uploadedImage;
  }
}
