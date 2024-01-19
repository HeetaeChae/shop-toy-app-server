import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserPayloadDto } from 'src/auth/dto/user-payload.dto';
import { UserPayload } from 'src/decorators/user-payload.decorator';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { NoticesService } from './notices.service';

@Controller('notices')
@ApiTags('notices')
export class NoticesController {
  constructor(private noticesService: NoticesService) {}

  @Post('')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '공지사항 생성', description: '공지사항 생성 기능' })
  async createNotice(
    @UserPayload() userPayloadDto: UserPayloadDto,
    @Body() createNoticeDto: CreateNoticeDto,
  ) {
    const { id } = userPayloadDto;
    const { title, content, isActive } = createNoticeDto;
    return this.noticesService.createNotice(id, title, content, isActive);
  }
}
