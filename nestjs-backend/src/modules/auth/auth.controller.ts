import { BadRequestException, Controller, Get } from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { UserService } from '../user/user.service';
import { User } from 'src/modules/user/user.types';
import { User as UserDecorator } from 'src/decorators/user.decorators';
import { FunctionLogger } from 'src/shared/utils';

@Controller('auth')
export class AuthController {
  private readonly logger = new FunctionLogger(AuthController.name);
  constructor(private readonly userService: UserService) {}

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
}
