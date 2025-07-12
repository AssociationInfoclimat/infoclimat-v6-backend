import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/decorators/auth.decorator';
import { User as UserDecorator } from 'src/decorators/user.decorator';
import { User } from './user.types';
import { FunctionLogger } from 'src/shared/utils';

@Controller('user')
export class UserController {
  private readonly logger = new FunctionLogger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @Auth()
  async getMe(@UserDecorator() user: User) {
    try {
      return this.userService.getUser(user.id);
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
