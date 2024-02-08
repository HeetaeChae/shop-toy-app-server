import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Search } from 'src/entities/Search.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class SearchesService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Search) private searchesRepository: Repository<Search>,
  ) {}
  // 내 최근 검색어 (10개)
  async getMySearches(userId: number) {
    return this.searchesRepository
      .createQueryBuilder('searchs')
      .innerJoin('searches.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('searches.createdAt', 'DESC')
      .groupBy('searches.keyword')
      .limit(10)
      .getMany();
  }

  // 1개월간 트렌드 검색어 (10개)
  async getTrendSearches() {
    return this.searchesRepository
      .createQueryBuilder('searches')
      .select('searches.keyword, COUNT(searches.keyword) as searchCount')
      .groupBy('searches.keyword')
      .orderBy('searchCount', 'DESC')
      .limit(10)
      .getMany();
  }

  // 검색어 생성
  async createSearch(userId: number, keyword: string) {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    const newSearch = await this.searchesRepository.create({ user, keyword });
    return this.searchesRepository.save(newSearch);
  }

  // 검색어 삭제
  async deleteMySearch(userId: number, searchId: number) {
    const searchToDelete = await this.searchesRepository.findOne({
      where: { id: searchId },
    });
    if (searchToDelete.user.id !== userId) {
      throw new ForbiddenException('해당 검색어를 작성힌 유저가 아닙니다.');
    }
    const deletedSearch = await this.searchesRepository.delete(searchId);
    if (deletedSearch.affected === 0) {
      throw new NotFoundException('검색어가 삭제처리되지 않습니다.');
    }
    return deletedSearch;
  }
}
