import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserPayloadDto } from 'src/auth/dto/user-payload.dto';
import { UserPayload } from 'src/decorators/user-payload.decorator';
import { CreateTagProductDto } from './dto/create-tag-product.dto';
import { DeleteTagProductDto } from './dto/delete-tag-product.dto';
import { TagsService } from './tags.service';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @ApiOperation({
    summary: '특정 태그의 태그상품 가져오기',
    description: '특정 태그의 태그상품 가져오기 기능 (20개씩)',
  })
  @Get(':name')
  async getTagProducts(
    @Param('name') name: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    return this.tagsService.getTagProducts(name, page, pageSize);
  }

  @ApiOperation({
    summary: '모든 태그 가져오기',
    description: '모든 태그 가져오기 기능 (20개씩)',
  })
  @Get()
  async getTags(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    return this.tagsService.getTags(page, pageSize);
  }

  @ApiOperation({
    summary: '태그상품 생성하기',
    description: '태그상품 생성하기 기능',
  })
  @UseGuards(AuthGuard)
  @Post()
  async createTagProduct(
    @UserPayload() userPayloadDto: UserPayloadDto,
    @Body() createTagProductDto: CreateTagProductDto,
  ) {
    const { roles } = userPayloadDto;
    const { name, productId } = createTagProductDto;
    return this.tagsService.createTagProduct(roles, name, productId);
  }

  @ApiOperation({
    summary: '태그상품 삭제하기',
    description: '태그상품 삭제하기 기능',
  })
  @UseGuards(AuthGuard)
  @Delete(':name')
  async DeleteTagProduct(
    @UserPayload() userPayloadDto: UserPayloadDto,
    @Param('name') name: string,
    @Body() deletePayloadDto: DeleteTagProductDto,
  ) {
    const { roles } = userPayloadDto;
    const { productId } = deletePayloadDto;
    return this.tagsService.deleteTagProduct(roles, name, productId);
  }
}
