import type { NestMiddleware } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import type { NextFunction, Response } from 'express';
import type { Request } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import { User } from 'src/modules/user/user.types';
import { UserService } from 'src/modules/user/user.service';

export type ICRequest = Request & {
  user?: User;
};

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(UserAuthMiddleware.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async use(request: ICRequest, _res: Response, next: NextFunction) {
    const userInfoclimatToken = request.get('x-ic-token');
    let user: User | undefined = undefined;
    if (userInfoclimatToken !== undefined) {
      try {
        this.logger.debug(`userInfoclimatToken: ${userInfoclimatToken}`);
        const verifiedAccountId =
          await this.authService.verifyCookieToAccountId(userInfoclimatToken);
        user = (await this.userService.getUser(verifiedAccountId)) || undefined;
        if (!user) {
          throw new Error('errors.user.user_not_found');
        }
      } catch {
        // user is just not authenticated..
        user = undefined;
      }
    }
    request.user = user;
    next();
  }
}
