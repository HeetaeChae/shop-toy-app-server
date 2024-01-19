import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/entities/Tag.entity';
import { Roles } from 'src/enums/roles.enum';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private tagsRepository: Repository<Tag>,
    private usersService: UsersService,
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
  ) {}

  // 특정 태그와 태그상품 (20개씩) 가져오기
  async getTagProducts(name: string, page: number, pageSize: number) {
    const tagProducts = this.tagsRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.products', 'products')
      .where('tag.name = :name', { name })
      .skip((page - 1) * pageSize)
      .take(page * pageSize)
      .getMany();
    if (!tagProducts) {
      throw new NotFoundException('해당 태그의 상품을 찾을 수 없습니다.');
    }
    return tagProducts;
  }

  // 모든 태그 (20개씩) 가져오기
  async getTags(page: number, pageSize: number) {
    const tags = this.tagsRepository.find({
      skip: (page - 1) * pageSize,
      take: page * pageSize,
    });
    if (!tags) {
      throw new NotFoundException('태그를 찾을 수 없습니다.');
    }
    return tags;
  }

  // 태그 및 태그상품 생성
  async createTagProduct(roles: number, name: string, productId: number) {
    if (roles === Roles.USER) {
      throw new UnauthorizedException('일반 회원은 태그를 생성할 수 없습니다.');
    }
    const product = await this.productsService.getProductById(productId);
    if (!product) {
      throw new NotFoundException('해당 상품이 존재하지 않습니다.');
    }
    const existingTag = await this.tagsRepository.findOne({
      where: { name },
      relations: { products: true },
    });
    if (existingTag) {
      const existingTagProduct = existingTag.products.find(
        (product) => product.id === productId,
      );
      if (existingTagProduct) {
        throw new ConflictException('태그상품이 이미 존재합니다.');
      }
      existingTag.products.push(product);
      return this.tagsRepository.save(existingTag);
    }
    const newTag = await this.tagsRepository.create({ name });
    const savedTag = await this.tagsRepository.save(newTag);
    savedTag.products.push(product);
    return this.tagsRepository.save(savedTag);
  }

  // 태그상품 삭제
  async deleteTagProduct();
}
