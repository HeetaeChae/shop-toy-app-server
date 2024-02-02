import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Roles } from 'src/enums/roles.enum';

export const IsAdminRoles = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp().getRequest();
    const { user } = context;
    return user.roles === Roles.ADMIN;
  },
);
