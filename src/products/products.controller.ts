import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/auth-status.guard';
import { IsUserRoles } from 'src/decorators/is-user-roles.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { CreateProductImgUrlDto } from './dto/create-product-img-url.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 상품 생성하기
  @ApiOperation({ summary: '상품 생성', description: '상품 생성하기' })
  @ApiConsumes('multipart/form-data')
  @UseGuards(LoggedInGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createPost(
    @UserId() userId: number,
    @IsUserRoles() IsUserRoles: boolean,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file, createProductDto);
    if (IsUserRoles) {
      throw new UnauthorizedException('일반 유저는 상품을 등록할 수 없습니다.');
    }
    // return this.productsService.createProduct(userId, createProductDto);
  }
}
