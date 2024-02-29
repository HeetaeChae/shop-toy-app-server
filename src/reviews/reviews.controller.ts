import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  LoggedInGuard,
  GetPayloadIfLoggedInGuard,
} from 'src/auth/auth-status.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { ReviewOrderBy, ReviewOrderName } from 'src/enums/review-order.enum';
import { UploadImageDto } from 'src/uploads/dto/upload-image.dto';
import { CreateReviewDto } from './dto/create-review-dto';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @ApiOperation({
    summary: '해당 상품 리뷰 불러오기',
    description: '해당 상품 리뷰 불러오기 기능',
  })
  @UseGuards(GetPayloadIfLoggedInGuard)
  @Get('product/:id')
  async getReviews(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) productId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 20,
    @Query('orderName') orderName: ReviewOrderName = ReviewOrderName.CREATED_AT,
    @Query('orderBy') orderBy: ReviewOrderBy = ReviewOrderBy.DESC,
  ) {
    return this.reviewsService.getReviews({
      userId,
      productId,
      page,
      pageSize,
      orderName,
      orderBy,
    });
  }

  @ApiOperation({
    summary: '내가 쓴 리뷰 불러오기',
    description: '내가 쓴 리뷰 불러오기 기능',
  })
  @UseGuards(LoggedInGuard)
  @Get('my')
  async getMyReviews(@UserId() userId: number) {
    return this.reviewsService.getMyReviews(userId);
  }

  @ApiOperation({
    summary: '리뷰 생성하기',
    description: '리뷰 생성하기 기능',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto })
  @UseGuards(LoggedInGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createReview(
    @UserId() userId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    const { rating, content, productId } = createReviewDto;
    return this.reviewsService.createReview({
      userId,
      productId,
      rating,
      content,
      file,
    });
  }

  // 리뷰 수정하기

  // 리뷰 삭제하기

  // 리뷰 댓글 생성하기

  // 리뷰 좋아요 생성하기
}
