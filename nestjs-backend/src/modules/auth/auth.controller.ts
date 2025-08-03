import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { UserService } from '../user/user.service';
import { User } from 'src/modules/user/user.types';
import { User as UserDecorator } from 'src/decorators/user.decorator';
import {
  FunctionLogger,
  getIPFromRequest,
  toSnakeCase,
} from 'src/shared/utils';
import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new FunctionLogger(AuthController.name);
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('me')
  @Auth()
  async me(@UserDecorator() user: User) {
    try {
      return this.userService.getUser(user.id);
    } catch (error) {
      this.logger.error(`${error}`);
      throw new BadRequestException(error);
    }
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Req() req: Request) {
    try {
      console.log('body', body);
      // See `toSnakeCase` in controllers. Use it just to be explicit instead of letting interceptor do it.
      return toSnakeCase({
        cookieToken: await this.authService.login({
          username: body.username,
          password: body.password,
          ip: getIPFromRequest(req),
          uagent: (req as any)?.headers
            ? (req as any).headers['user-agent']
            : '',
        }),
      });
    } catch (error) {
      this.logger.error(`${error}`);
      throw new BadRequestException(error);
    }
  }
}
