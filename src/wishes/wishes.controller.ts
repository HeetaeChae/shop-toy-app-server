import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserPayloadDto } from 'src/auth/dto/user-payload.dto';
import { UserPayload } from 'src/decorators/user-payload.decorator';
import { WishesService } from './wishes.service';

@ApiTags('wishes')
@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @ApiOperation({
    summary: '찜한 상품 리스트 가져오기',
    description: '찜한 상품 리스트 가져오기 기능',
  })
  @UseGuards(AuthGuard)
  @Get('')
  async getWishProducts(@UserPayload() userPayloadDto: UserPayloadDto) {
    const userId = userPayloadDto.id;
    return this.wishesService.getWishProducts(userId);
  }

  @ApiOperation({ summary: '상품 찜등록', description: '상품 찜등록 기능' })
  @UseGuards(AuthGuard)
  @Post(':wishId/products/:productId')
  async createWishProduct(
    @UserPayload() userPayloadDto: UserPayloadDto,
    @Param('wishId') wishId: number,
    @Param('productId') productId: number,
  ) {
    const userId = userPayloadDto.id;
    return this.wishesService.createWishProduct(userId, wishId, productId);
  }

  @ApiOperation({
    summary: '모든 찜 상품 삭제',
    description: '모든 찜한 상품 삭제 기능',
  })
  @UseGuards(AuthGuard)
  @Delete(':wishId')
  async deleteWishProducts(
    @UserPayload() userPayloadDto: UserPayloadDto,
    @Param('wishId') wishId: number,
  ) {
    const userId = userPayloadDto.id;
    return this.wishesService.deleteWishProducts(userId, wishId);
  }

  @ApiOperation({
    summary: '특정 찜 상품 삭제',
    description: '특정 찜한 상품 삭제 기능',
  })
  @UseGuards(AuthGuard)
  @Delete(':wishId/products/:productId')
  async deleteWishProduct(
    @UserPayload() userPayloadDto: UserPayloadDto,
    @Param('wishId') wishId: number,
    @Param('productId') productId: number,
  ) {
    const userId = userPayloadDto.id;
    return this.wishesService.deleteWishProduct(userId, wishId, productId);
  }
}
