import type { ExecutionContext } from '@nestjs/common';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { STRATEGY_NAME } from './auth.strategy';
import { User } from 'src/modules/user/user.types';

@Injectable()
// Gonna use passport-custom strategy
// See auth.strategy.ts
export class InfoclimatAuthGuard extends AuthGuard(STRATEGY_NAME) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<T extends User>(
    err: any,
    user: T,
    info: any,
    context: ExecutionContext,
    _status?: any,
  ) {
    if (user && !err && !info) {
      const request = context.switchToHttp().getRequest();
      /*if (
        user.status !== AccountStatus.ACTIVE &&
        ['POST', 'PUT', 'DELETE', 'PATCH'].indexOf(request.method) > -1 // but HEAD might be available
      ) {
        // Account not validated yet
        throw new ForbiddenException('errors.account_unvalidated');
      }*/
      return user;
    } else {
      throw err || new UnauthorizedException(null, 'errors.not_authorized');
    }
  }
}
