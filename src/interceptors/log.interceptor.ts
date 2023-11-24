import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private counter = 1
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const dt = Date.now()
    return next
      .handle()
      .pipe(
        tap(() => {
          const request = context.switchToHttp().getRequest()
          console.log(`${this.counter++}° requisição - ${request.method} na URL: ${request.url} levou: ${Date.now() - dt} milissegundos para ser executado`)
        }),
      );
  }
}
