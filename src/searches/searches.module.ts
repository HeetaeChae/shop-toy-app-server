import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Search } from 'src/entities/Search.entity';
import { UsersModule } from 'src/users/users.module';
import { SearchesController } from './searches.controller';
import { SearchesService } from './searches.service';

@Module({
  imports: [TypeOrmModule.forFeature([Search]), UsersModule],
  controllers: [SearchesController],
  providers: [SearchesService],
})
export class SearchesModule {}
