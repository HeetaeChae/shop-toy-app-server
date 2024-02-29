import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/auth-status.guard';
import { IsUserRoles } from 'src/decorators/is-user-roles.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { CreateTagProductDto } from './dto/create-tag-product.dto';
import { TagsService } from './tags.service';

@ApiTags('tags')
@Controller('api/tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @ApiOperation({
    summary: '모든 태그 가져오기',
    description: '모든 태그 가져오기 기능 (20개씩)',
  })
  @ApiQuery({
    name: 'page',
    description: '가져올 페이지',
    example: 1,
    required: true,
  })
  @ApiQuery({
    name: 'pageSize',
    description: '가져올 데이터 개수',
    example: 20,
    required: true,
  })
  @Get()
  async getTags(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 20,
  ) {
    console.log('?');
    return this.tagsService.getTags(page, pageSize);
  }

  @ApiOperation({
    summary: '특정 태그의 태그상품 가져오기',
    description: '특정 태그의 태그상품 가져오기 기능 (20개씩)',
  })
  @Get(':name/tag-products')
  async getTagProducts(
    @Param('name') tagName: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 20,
  ) {
    return this.tagsService.getTagProducts(tagName, page, pageSize);
  }

  @ApiOperation({
    summary: '태그상품 생성하기',
    description: '태그상품 생성하기 기능',
  })
  @UseGuards(LoggedInGuard)
  @Post('tag-products')
  async createTagProduct(
    @IsUserRoles() isUserRoles: boolean,
    @Body() createTagProductDto: CreateTagProductDto,
  ) {
    if (isUserRoles) {
      throw new ForbiddenException(
        '일반 회원은 태그상품을 생성할 수 없습니다.',
      );
    }
    const { tagName, productId } = createTagProductDto;
    return this.tagsService.createTagProduct(tagName, productId);
  }

  @ApiOperation({
    summary: '상품태그 삭제하기',
    description: '상품태그 삭제하기 기능',
  })
  @UseGuards(LoggedInGuard)
  @Delete(':name/products/:id/tag-products')
  async DeleteTagProduct(
    @UserId() userId: number,
    @IsUserRoles() isUserRoles: boolean,
    @Param('name') tagName: string,
    @Param('id', ParseIntPipe) productId: number,
  ) {
    if (isUserRoles) {
      throw new ForbiddenException(
        '일반 회원을 상품태그를 삭제할 수 없습니다.',
      );
    }
    return this.tagsService.deleteTagProduct(userId, tagName, productId);
  }
}
