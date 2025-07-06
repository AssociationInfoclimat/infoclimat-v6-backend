import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { toSnakeCase } from '../utils';

export interface Response<T> {
  success: boolean;
  data: T;
}
@Injectable()
export class SnakeCaseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const snakedData = toSnakeCase(data);
        const cleanedResponse = {
          success: true,
          data: snakedData,
        } as Response<T>;
        return cleanedResponse;
      }),
    );
  }
}
