import { Test, TestingModule } from '@nestjs/testing';
import { RecentlyViewedProductsService } from './recently-viewed-products.service';

describe('RecentlyViewedProductsService', () => {
  let service: RecentlyViewedProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecentlyViewedProductsService],
    }).compile();

    service = module.get<RecentlyViewedProductsService>(RecentlyViewedProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
