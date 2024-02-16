import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Search } from 'src/entities/Search.entity';
import { User } from 'src/entities/User.entity';
import { UsersService } from 'src/users/users.service';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class SearchesService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Search) private searchesRepository: Repository<Search>,
  ) {}

  // 내가 한 검색인지 체크
  async checkIsOwnSearch(
    user: User,
    searchId: number,
  ): Promise<void | undefined> {
    const isOwnSearch = await this.searchesRepository.findOne({
      where: { user, id: searchId },
    });
    if (!isOwnSearch) {
      throw new ForbiddenException('내가 한 검색이 아닙니다.');
    }
  }

  // 내 최근 검색어 (10개)
  async getMySearches(userId: number): Promise<Search[] | undefined> {
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
  async getTrendSearches(): Promise<Search[] | undefined> {
    return this.searchesRepository
      .createQueryBuilder('searches')
      .select('searches.keyword')
      .addSelect('COUNT(*) AS searchedCount')
      .orderBy('searchedCount', 'DESC')
      .groupBy('searches.keyword')
      .limit(10)
      .getRawMany();
  }

  // 검색어 생성
  async createSearch(
    userId: number,
    keyword: string,
  ): Promise<Search | undefined> {
    const user = await this.usersService.getUserById(userId);
    const newSearch = await this.searchesRepository.create({ user, keyword });
    return this.searchesRepository.save(newSearch);
  }

  // 검색어 삭제
  async deleteMySearch(
    userId: number,
    searchId: number,
  ): Promise<DeleteResult | undefined> {
    const user = await this.usersService.getUserById(userId);
    await this.checkIsOwnSearch(user, searchId);
    const deletedSearch = await this.searchesRepository.delete(searchId);
    if (deletedSearch.affected === 0) {
      throw new NotFoundException('검색어가 삭제처리되지 않습니다.');
    }
    return deletedSearch;
  }
}
