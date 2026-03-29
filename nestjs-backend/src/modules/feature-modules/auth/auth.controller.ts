import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { UserService } from 'src/modules/entity-modules/user/user.service';
import { User } from 'src/modules/entity-modules/user/user.types';
import { User as UserDecorator } from 'src/decorators/user.decorator';
import {
  FunctionLogger,
  getIPFromRequest,
  toSnakeCase,
} from 'src/shared/utils';
import { LoginDto, LoginResponseDto, UserDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('')
export class AuthController {
  private readonly logger = new FunctionLogger(AuthController.name);
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('/auth/me')
  @Auth()
  async me(@UserDecorator() user: User): Promise<UserDto> {
    try {
      return UserDto.toDto(await this.userService.getUser(user.id));
    } catch (error) {
      this.logger.error(`${error}`);
      throw new BadRequestException(error);
    }
  }

  @Post('/auth/login')
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
  ): Promise<LoginResponseDto> {
    try {
      // TODO: Use DTO for response
      const response = toSnakeCase({
        cookieToken: await this.authService.login({
          username: body.username,
          password: body.password,
          ip: getIPFromRequest(req),
          uagent:
            req?.headers && req.headers['user-agent']
              ? req.headers['user-agent']
              : '',
        }),
      });
      return LoginResponseDto.toDto(response.cookie_token);
    } catch (error) {
      this.logger.error(`${error}`);
      throw new BadRequestException(error);
    }
  }
}
