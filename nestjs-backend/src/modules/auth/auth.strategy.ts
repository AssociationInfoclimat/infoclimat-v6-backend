import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ICRequest } from 'src/middlewares/user-auth.middleware';
import { User } from 'src/modules/user/user.types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FunctionLogger } from 'src/shared/utils';

export const STRATEGY_NAME = 'ic';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, STRATEGY_NAME) {
  private readonly logger = new FunctionLogger(AuthStrategy.name);
  constructor() {
    super();
  }

  // Authentification verifation is now done in User Middleware
  async validate(req: ICRequest): Promise<User> {
    const userInfoclimatToken = req.get('x-ic-token');
    try {
      if (userInfoclimatToken === undefined) {
        this.logger.error(`${JSON.stringify(req.headers)}`);
        throw new UnauthorizedException('errors.no_token');
      }
      if (req.user) {
        return req.user;
      } else {
        throw new UnauthorizedException('errors.invalid_token');
      }
    } catch (e) {
      this.logger.error(`${e}`);
      throw e;
    }
  }
}
