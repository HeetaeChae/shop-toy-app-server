import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request;
    return user;
  },
);
