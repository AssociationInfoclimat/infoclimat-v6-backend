import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
}
@Injectable()
export class DataResponseInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        //
        // We used to automatically snake-case the data,
        //  but it's too dangerous and unexpected to do it automatically,
        //  especially when we will have sometimes the new version of our data,
        //  and sometimes the old version/legacy of our data.

        const cleanedResponse = {
          success: true,
          data: data,
        } as Response<T>;
        return cleanedResponse;
      }),
    );
  }
}
