import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/auth-status.guard';
import { IsAdminRoles } from 'src/decorators/is-admin-roles.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice-dto';
import { NoticesService } from './notices.service';

@Controller('api/notices')
@ApiTags('notices')
export class NoticesController {
  constructor(private noticesService: NoticesService) {}

  @ApiOperation({
    summary: '모든 공지사항 가져오기',
    description: '모든 공지사항 가져오기 기능',
  })
  @Get()
  async getNotices() {
    return this.noticesService.getNotices();
  }

  @ApiOperation({
    summary: '특정 공지사항 가져오기',
    description: '특정 공지사항 가져오기 기능',
  })
  @ApiParam({
    name: 'id',
    description: '공지사항 id',
    example: 1,
    required: true,
  })
  @Get(':id')
  async getNotice(@Param('id', ParseIntPipe) noticeId: number) {
    return this.noticesService.getNotice(noticeId);
  }

  @ApiOperation({ summary: '공지사항 생성', description: '공지사항 생성 기능' })
  @Post()
  @UseGuards(LoggedInGuard)
  async createNotice(
    @IsAdminRoles() isAdminRoles: boolean,
    @UserId() userId: number,
    @Body() createNoticeDto: CreateNoticeDto,
  ) {
    if (!isAdminRoles) {
      throw new ForbiddenException(
        '어드민 계정만 공지사항을 생성할 수 있습니다.',
      );
    }
    const { title, content, isActive } = createNoticeDto;
    return this.noticesService.createNotice(userId, title, content, isActive);
  }

  @ApiOperation({ summary: '공지사항 수정', description: '공지사항 수정 기능' })
  @ApiParam({
    name: 'id',
    description: '공지사항 id',
    example: 1,
    required: true,
  })
  @Patch(':id')
  @UseGuards(LoggedInGuard)
  async updateNotice(
    @IsAdminRoles() isAdminRoles: boolean,
    @UserId() userId: number,
    @Param('id', ParseIntPipe) noticeId: number,
    @Body() updateNoticeDto: UpdateNoticeDto,
  ) {
    if (!isAdminRoles) {
      throw new ForbiddenException(
        '어드민 계정만 공지사항을 수정할 수 있습니다.',
      );
    }
    const { title, content, isActive } = updateNoticeDto;
    return this.noticesService.updateNotice(
      userId,
      noticeId,
      title,
      content,
      isActive,
    );
  }
}
