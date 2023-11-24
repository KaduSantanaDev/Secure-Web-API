import { createParamDecorator, ExecutionContext, NotFoundException } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    if (request.user) {
      if(data) {
        return request.user[data]
      }
      return request.user
    } else {
      throw new NotFoundException('Usuário não encontrado no request. Use o Auth Guard para obter o usuário')
    }
  },
);