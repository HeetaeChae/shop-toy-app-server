import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from 'src/entities/Notice.entity';
import { User } from 'src/entities/User.entity';
import { IsActive } from 'src/enums/is-active.enum';
import { UsersService } from 'src/users/users.service';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice) private noticeRepository: Repository<Notice>,
    private usersService: UsersService,
  ) {}

  async checkIsOwnNotice(
    user: User,
    noticeId: number,
  ): Promise<void | undefined> {
    const ownNotice = await this.noticeRepository.findOne({
      where: { id: noticeId, user },
    });
    if (!ownNotice) {
      throw new ForbiddenException('내가 작성한 공지사항이 아닙니다.');
    }
  }

  async getNotices(): Promise<Notice[] | undefined> {
    return this.noticeRepository.find({ relations: ['user'] });
  }

  async getNotice(noticeId: number): Promise<Notice> {
    return this.noticeRepository.findOne({
      where: { id: noticeId },
      relations: ['user'],
    });
  }

  async createNotice(
    userId: number,
    title: string,
    content: string,
    isActive: IsActive,
  ): Promise<Notice | undefined> {
    const user = await this.usersService.getUserById(userId);
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
  ): Promise<UpdateResult | undefined> {
    const user = await this.usersService.getUserById(userId);
    await this.checkIsOwnNotice(user, noticeId);
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
}
