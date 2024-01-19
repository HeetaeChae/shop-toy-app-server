import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from 'src/entities/Notice.entity';
import { IsActive } from 'src/enums/is-active.enum';
import { Roles } from 'src/enums/roles.enum';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice) private noticeRepository: Repository<Notice>,
    private usersService: UsersService,
  ) {}

  async createNotice(
    userId: number,
    title: string,
    content: string,
    isActive: IsActive,
  ) {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException('계정을 찾을 수 없습니다.');
    }
    if (user.roles !== Roles.ADMIN) {
      throw new UnauthorizedException(
        '공지사항은 어드민계정만 생성할 수 있습니다.',
      );
    }
    const newNotice = await this.noticeRepository.create({
      user,
      title,
      content,
      isActive,
    });
    return this.noticeRepository.save(newNotice);
  }
}
