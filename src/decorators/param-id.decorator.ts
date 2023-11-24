import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParamId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return Number(ctx.switchToHttp().getRequest().params.id)
  },
);