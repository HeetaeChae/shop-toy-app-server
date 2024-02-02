import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadFile(@UploadedFiles() files) {
    return this.uploadsService.uploadImage(files);
  }
}
