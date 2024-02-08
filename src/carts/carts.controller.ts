import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/auth-status.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { CartsService } from './carts.service';
import { CreateCartProductDto } from './dto/create-cart-product.dto';
import { UpdateCartProductDto } from './dto/update-cart-product.dto';

@ApiTags('carts')
@Controller('carts')
export class CartsController {
  constructor(private cartsService: CartsService) {}
  // 장바구니 상품 가져오기
  @ApiOperation({
    summary: '장바구니 상품 가져오기',
    description: '장바구니 상품 가져오기 기능',
  })
  @UseGuards(LoggedInGuard)
  @Get('/cart-product')
  async getCartProducts(@UserId() userId: number) {
    return this.cartsService.getCartProducts(userId);
  }

  // 장바구니 체크처리
  @ApiOperation({
    summary: '장바구니 체크 처리',
    description: '장바구니 체크 처리 기능',
  })
  @UseGuards(LoggedInGuard)
  @Patch(':id/check')
  async checkCart(@UserId() userId: number, @Param('id') cartId: number) {
    return this.cartsService.checkCart(userId, cartId);
  }

  // 장바구니 상품 등록
  @ApiOperation({
    summary: '장바구니 상품 등록',
    description: '장바구니 상품 등록 기능',
  })
  @UseGuards(LoggedInGuard)
  @Post('/cart-product')
  async createCartProduct(
    @UserId() userId: number,
    @Body() createCartProductDto: CreateCartProductDto,
  ) {
    const { cartId, productId, quantity, size, color } = createCartProductDto;
    return this.cartsService.createCartProduct({
      userId,
      cartId,
      productId,
      quantity,
      size,
      color,
    });
  }

  // 장바구니 상품 수정
  @ApiOperation({
    summary: '장바구니 상품 수정',
    description: '장바구니 상품 수정 기능',
  })
  @UseGuards(LoggedInGuard)
  @Patch(':id/cart-product/:id')
  async updateCartProduct(
    @UserId() userId: number,
    @Param('id') cartId: number,
    @Param('id') cartProductId: number,
    @Body() updateCartProductDto: UpdateCartProductDto,
  ) {
    const { quantity, size, color } = updateCartProductDto;
    return this.cartsService.updateCartProduct({
      userId,
      cartId,
      cartProductId,
      quantity,
      size,
      color,
    });
  }

  // 장바구니 상품 삭제
  @ApiOperation({
    summary: '장바구니 상품 삭제',
    description: '장바구니 상품 삭제 기능',
  })
  @UseGuards(LoggedInGuard)
  @Delete(':id/cart-product/:id')
  async deleteCartProduct(
    @UserId() userId: number,
    @Param('id') cartId: number,
    @Param('id') cartProductId: number,
  ) {
    return this.cartsService.deleteCartProduct(userId, cartId, cartProductId);
  }
}
