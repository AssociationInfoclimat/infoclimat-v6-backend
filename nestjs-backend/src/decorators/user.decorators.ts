import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { ICRequest } from 'src/middlewares/user-auth.middleware';

// See the user-auth.middleware.ts for the middleware that sets the user on the request
//  and then the auth guard that checks if the user is authenticated (or throws an error)
export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as ICRequest;
    return request.user;
  },
);
