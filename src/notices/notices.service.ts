import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from 'src/entities/Notice.entity';
import { IsActive } from 'src/enums/is-active.enum';
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
    const newNotice = await this.noticeRepository.create({
      user,
      title,
      content,
      isActive,
    });
    return this.noticeRepository.save(newNotice);
  }
}
