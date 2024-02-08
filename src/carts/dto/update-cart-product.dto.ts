import { PickType } from '@nestjs/swagger';
import { CreateCartProductDto } from './create-cart-product.dto';

export class UpdateCartProductDto extends PickType(CreateCartProductDto, [
  'color',
  'quantity',
  'size',
] as const) {}
