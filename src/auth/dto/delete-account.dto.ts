import { PickType } from '@nestjs/swagger';
import { SignupDto } from './signup.dto';

export class DeleteAccountDto extends PickType(SignupDto, [
  'password',
] as const) {}
