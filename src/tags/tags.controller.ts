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
import { AuthGuard } from 'src/auth/auth.guard';
import { UserPayloadDto } from 'src/auth/dto/user-payload.dto';
import { IsUserRoles } from 'src/decorators/is-user-roles.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { UserPayload } from 'src/decorators/user-payload.decorator';
import { CreateTagProductDto } from './dto/create-tag-product.dto';
import { TagsService } from './tags.service';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @ApiOperation({
    summary: '특정 태그의 태그상품 가져오기',
    description: '특정 태그의 태그상품 가져오기 기능 (20개씩)',
  })
  @ApiQuery({ name: '페이지', type: 'number' })
  @ApiQuery({ name: '페이지 요소 개수', type: 'number' })
  @Get(':name/tag-products')
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
  @ApiQuery({ name: '페이지', type: 'number' })
  @ApiQuery({ name: '페이지 요소 개수', type: 'number' })
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
