import { PickType } from '@nestjs/swagger';
import { CreateTagProductDto } from './create-tag-product.dto';

export class DeleteTagProductDto extends PickType(CreateTagProductDto, [
  'productId' as const,
]) {}
