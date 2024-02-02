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
    const { wishId, productId } = createWishProductDto;
    return this.wishesService.createWishProduct(userId, wishId, productId);
  }

  @ApiOperation({
    summary: '내가 찜한 모든 상품 삭제',
    description: '내가 찜한 모든 상품 삭제 기능',
  })
  @UseGuards(LoggedInGuard)
  @Delete(':id/wish-products')
  async deleteWishProducts(
    @UserId() userId: number,
    @Param('id') wishId: number,
  ) {
    return this.wishesService.deleteWishProducts(userId, wishId);
  }

  @ApiOperation({
    summary: '내가 찜한 특정 상품 삭제',
    description: '내가 찜한 특정 상품 삭제 기능',
  })
  @UseGuards(LoggedInGuard)
  @Delete(':id/products/:id/wish-products')
  async deleteWishProduct(
    @UserId() userId: number,
    @Param('id') wishId: number,
    @Param('id') productId: number,
  ) {
    return this.wishesService.deleteWishProduct(userId, wishId, productId);
  }
}
