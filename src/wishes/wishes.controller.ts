import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/auth-status.guard';
import { UserPayloadDto } from 'src/auth/dto/user-payload.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { UserPayload } from 'src/decorators/user-payload.decorator';
import { CreateWishProductDto } from './dto/create-wish-product.dto';
import { WishesService } from './wishes.service';

@ApiTags('wishes')
@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @ApiOperation({
    summary: '내가 찜한 상품 리스트 가져오기',
    description: '내가 찜한 상품 리스트 가져오기 기능',
  })
  @UseGuards(LoggedInGuard)
  @Get('wish-products')
  async getWishProducts(@UserId() userId: number) {
    return this.wishesService.getWishProducts(userId);
  }

  @ApiOperation({ summary: '상품 찜등록', description: '상품 찜등록 기능' })
  @UseGuards(LoggedInGuard)
  @Post('wish-products')
  async createWishProduct(
    @UserId() userId: number,
    @Body() createWishProductDto: CreateWishProductDto,
  ) {
    const { productId } = createWishProductDto;
    return this.wishesService.createWishProduct(userId, productId);
  }

  @ApiOperation({
    summary: '내가 찜한 모든 상품 삭제',
    description: '내가 찜한 모든 상품 삭제 기능',
  })
  @UseGuards(LoggedInGuard)
  @Delete('wish-products')
  async deleteWishProducts(@UserId() userId: number) {
    return this.wishesService.deleteWishProducts(userId);
  }

  @ApiOperation({
    summary: '내가 찜한 특정 상품 삭제',
    description: '내가 찜한 특정 상품 삭제 기능',
  })
  @UseGuards(LoggedInGuard)
  @Delete('wish-products/:id')
  async deleteWishProduct(
    @UserId() userId: number,
    @Param('id') wishProductId: number,
  ) {
    return this.wishesService.deleteWishProduct(userId, wishProductId);
  }
}
