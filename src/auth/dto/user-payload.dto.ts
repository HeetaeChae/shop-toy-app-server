import { PickType } from '@nestjs/swagger';
import { SignupDto } from './signup.dto';

export class UserPayloadDto extends PickType(SignupDto, [
  'email',
  'roles',
] as const) {
  id: number;
}
