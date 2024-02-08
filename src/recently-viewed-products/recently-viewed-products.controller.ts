import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/auth-status.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { CreateRecentlyViewedProductDto } from './dto/create-recently-viewed-product.dto';
import { RecentlyViewedProductsService } from './recently-viewed-products.service';

@ApiTags('recently-viewed-products')
@Controller('recently-viewed-products')
export class RecentlyViewedProductsController {
  constructor(
    private recentlyViewedProductsService: RecentlyViewedProductsService,
  ) {}

  // 내가 최근 본 상품 가져오기 (5개)
  @ApiOperation({
    summary: '내가 최근 본 상품 가져오기',
    description: '내가 최근 본 상품 가져오기 (5개) 기능',
  })
  @UseGuards(LoggedInGuard)
  @Get('my')
  async getMyRecentlyViewedProducts(@UserId() userId: number) {
    return this.recentlyViewedProductsService.getMyRecentlyViewedProducts(
      userId,
    );
  }

  // 최근 가장 많이 클릭된 상품 가져오기 (5개)
  @ApiOperation({
    summary: '최근 가장 많이 클릭된 상품 가져오기',
    description: '최근 가장 많이 클릭된 상품 가져오기 (5개)',
  })
  @Get('trend')
  async getTrendRecentlyViewedProducts() {
    return this.recentlyViewedProductsService.getTrendRecentlyViewedProducts();
  }

  // 최근 본 상품 등록
  @ApiOperation({
    summary: '최근 본 상품 등록',
    description: '최근 본 상품 등록 기능',
  })
  @UseGuards(LoggedInGuard)
  @Post()
  async createRecentlyViewedProduct(
    @UserId() userId: number,
    @Body() createRecentlyViewedProductDto: CreateRecentlyViewedProductDto,
  ) {
    const { productId } = createRecentlyViewedProductDto;
    return this.recentlyViewedProductsService.createRecentlyViewedProduct(
      userId,
      productId,
    );
  }

  // 최근 본 상품 삭제
  @ApiOperation({
    summary: '최근 본 상품 삭제',
    description: '최근 본 상품 삭제 기능',
  })
  @UseGuards(LoggedInGuard)
  @Delete(':id')
  async deleteRecentlyViewedProduct(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.recentlyViewedProductsService.deleteRecentlyViewedProduct(
      userId,
      id,
    );
  }
}
