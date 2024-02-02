import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/auth-status.guard';
import { IsAdminRoles } from 'src/decorators/is-admin-roles.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { NoticesService } from './notices.service';

@Controller('notices')
@ApiTags('notices')
export class NoticesController {
  constructor(private noticesService: NoticesService) {}

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
}
