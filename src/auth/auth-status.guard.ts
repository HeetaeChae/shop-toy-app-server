import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';

export class LoggedInGuard extends AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivateFromAuthGuard = await super.canActivate(context);
    if (!canActivateFromAuthGuard) {
      throw new UnauthorizedException('로그인 되지 않았습니다.');
    }
    return true;
  }
}

export class NotLoggedInGuard extends AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivateFromAuthGuard = await super.canActivate(context);
    if (canActivateFromAuthGuard) {
      throw new UnauthorizedException('로그인 되어 있습니다.');
    }
    return true;
  }
}

export class GetPayloadIfLoggedInGuard
  extends AuthGuard
  implements CanActivate
{
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivateFromAuthGuard = await super.canActivate(context);
    return canActivateFromAuthGuard;
  }
}
