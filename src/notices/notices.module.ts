import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from 'src/entities/Notice.entity';
import { UsersModule } from 'src/users/users.module';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notice]), UsersModule],
  controllers: [NoticesController],
  providers: [NoticesService],
})
export class NoticesModule {}
