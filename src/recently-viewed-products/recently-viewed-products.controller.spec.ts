import { Test, TestingModule } from '@nestjs/testing';
import { RecentlyViewedProductsController } from './recently-viewed-products.controller';

describe('RecentlyViewedProductsController', () => {
  let controller: RecentlyViewedProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecentlyViewedProductsController],
    }).compile();

    controller = module.get<RecentlyViewedProductsController>(RecentlyViewedProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
