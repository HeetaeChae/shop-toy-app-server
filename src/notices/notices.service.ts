import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
      throw new NotFoundException('계정을 찾을 수 없습니다.');
    }
    const newNotice = await this.noticeRepository.create({
      user,
      title,
      content,
      isActive,
    });
    return this.noticeRepository.save(newNotice);
  }

  async updateNotice(
    userId: number,
    noticeId: number,
    title: string,
    content: string,
    isActive: IsActive,
  ) {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('계정을 찾을 수 없습니다.');
    }
    const updatedToAddress = await this.noticeRepository.findOne({
      where: { id: noticeId },
    });
    if (updatedToAddress.user.id !== userId) {
      throw new ForbiddenException('해당 공지사항의 작성자가 아닙니다.');
    }
    const updatedAddress = await this.noticeRepository.update(noticeId, {
      title,
      content,
      isActive,
    });
    if (updatedAddress.affected === 0) {
      throw new NotFoundException('공지사항을 업데이트할 수 없습니다.');
    }
    return updatedAddress;
  }

  async getNotices() {
    return this.noticeRepository.find();
  }

  async getNotice(noticeId: number) {
    return this.noticeRepository.findOne({ where: { id: noticeId } });
  }
}
