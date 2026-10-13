import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

/** 统一响应结构：{ code, data, message }，code=0 表示成功 */
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next
      .handle()
      .pipe(map((data) => ({ code: 0, data, message: 'ok' })));
  }
}
