import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/Product.entity';
import { Tag } from 'src/entities/Tag.entity';
import { TagProduct } from 'src/entities/TagProduct.entity';
import { ProductsService } from 'src/products/products.service';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private tagsRepository: Repository<Tag>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(TagProduct)
    private tagProductsRepository: Repository<TagProduct>,
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
  ) {}

  async getTagByName(tagName: string): Promise<Tag | undefined> {
    const tag = await this.tagsRepository.findOne({ where: { name: tagName } });
    if (!tag) {
      throw new NotFoundException('태그를 찾을 수 없습니다.');
    }
    return tag;
  }

  // 모든 태그 (20개씩) 가져오기
  async getTags(page: number, pageSize: number): Promise<Tag[] | undefined> {
    return this.tagsRepository.find({
      skip: (page - 1) * pageSize,
      take: page * pageSize,
    });
  }

  // 특정 태그와 태그상품 (20개씩) 가져오기
  async getTagProducts(
    tagName: string,
    page: number,
    pageSize: number,
  ): Promise<Product[] | undefined> {
    return this.productsRepository
      .createQueryBuilder('product')
      .innerJoin('product.tagProducts', 'tagProducts')
      .innerJoin('tagProducts.tag', 'tag')
      .where('tag.name = :name', { name: tagName })
      .skip((page - 1) * pageSize)
      .take(page * pageSize)
      .getMany();
  }

  // 태그 및 태그상품 생성
  async createTagProduct(
    tagName: string,
    productId: number,
  ): Promise<TagProduct | undefined> {
    const product = await this.productsService.getProductById(productId);
    const existingTag = await this.tagsRepository.findOne({
      where: { name: tagName },
    });
    let savedTagProduct: TagProduct;
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
  async deleteTagProduct(
    userId: number,
    tagName: string,
    productId: number,
  ): Promise<UpdateResult | undefined> {
    const tag = await this.getTagByName(tagName);
    const product = await this.productsService.getProductById(productId);
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
    const deletedTagProduct = await this.tagProductsRepository.softDelete({
      id: tagProduct.id,
    });
    if (!deletedTagProduct) {
      throw new ForbiddenException('태그상품을 삭제할 수 없습니다.');
    }
    return deletedTagProduct;
  }
}
