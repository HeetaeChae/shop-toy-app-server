import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/entities/Tag.entity';
import { TagProduct } from 'src/entities/TagProduct.entity';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private tagsRepository: Repository<Tag>,
    @InjectRepository(TagProduct)
    private tagProductsRepository: Repository<TagProduct>,
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
  async createTagProduct(tagName: string, productId: number) {
    const product = await this.productsService.getProductById(productId);
    if (!product) {
      throw new NotFoundException('해당 상품이 존재하지 않습니다.');
    }
    const existingTag = await this.tagsRepository.findOne({
      where: { name: tagName },
    });
    let savedTagProduct;
    if (existingTag) {
      const newTagProduct = await this.tagProductsRepository.create({
        product,
        tag: existingTag,
      });
      savedTagProduct = await this.tagProductsRepository.save(newTagProduct);
    } else {
      const newTag = await this.tagsRepository.create({ name: tagName });
      const savedTag = await this.tagsRepository.save(newTag);
      const newTagProduct = await this.tagProductsRepository.create({
        product,
        tag: savedTag,
      });
      savedTagProduct = await this.tagProductsRepository.save(newTagProduct);
    }
    return savedTagProduct;
  }

  // 태그상품 삭제
  async deleteTagProduct(userId: number, tagName: string, productId: number) {
    const tag = await this.tagsRepository.findOne({ where: { name: tagName } });
    if (!tag) {
      throw new NotFoundException('해당 태그가 존재하지 않습니다.');
    }
    const product = await this.productsService.getProductById(productId);
    if (!product) {
      throw new NotFoundException('해당 상품이 존재하지 않습니다.');
    }
    const isProductAuthor = product.user.id === userId;
    if (!isProductAuthor) {
      throw new ForbiddenException('해당 상품의 등록자가 아닙니다.');
    }
    const tagProduct = await this.tagProductsRepository.findOne({
      where: { tag, product },
    });
    if (!tagProduct) {
      throw new NotFoundException('해당 상품태그가 존재하지 않습니다.');
    }
    const tagProductId = tagProduct.id;
    await this.tagProductsRepository.softDelete({ id: tagProductId });
  }
}
