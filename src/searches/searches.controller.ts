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
import { UserId } from 'src/decorators/user-id.decorator';
import { CreateSearchDto } from './dto/create-search.dto';
import { SearchesService } from './searches.service';

@ApiTags('searches')
@Controller('searches')
export class SearchesController {
  constructor(private searchesService: SearchesService) {}
  // 내 최근 검색어 (10개)
  @ApiOperation({
    summary: '내 최근 검색어 가져오기',
    description: '내 최근 검색어 10개 가져오기',
  })
  @UseGuards(LoggedInGuard)
  @Get('my')
  async getMySearches(@UserId() userId: number) {
    return this.searchesService.getMySearches(userId);
  }

  // 트랜드 검색어 (10개)
  @ApiOperation({
    summary: '트렌드 검색어 가져오기',
    description: '트렌드 검색어 10개 가져오기',
  })
  @Get('trend')
  async getTrendSearches() {
    return this.searchesService.getTrendSearches();
  }

  // 검색어 생성
  @ApiOperation({ summary: '검색어 생성', description: '검색어 생성하기 기능' })
  @UseGuards(LoggedInGuard)
  @Post()
  async createSearch(
    @UserId() userId: number,
    @Body() createSearchDto: CreateSearchDto,
  ) {
    const { keyword } = createSearchDto;
    return this.searchesService.createSearch(userId, keyword);
  }

  // 내 검색어 삭제
  @ApiOperation({
    summary: '내 검색어 삭제',
    description: '내 검색어 삭제 기능',
  })
  @UseGuards(LoggedInGuard)
  @Delete(':id')
  async deleteMySearch(
    @UserId() userId: number,
    @Param('id') searchId: number,
  ) {
    return this.searchesService.deleteMySearch(userId, searchId);
  }
}
