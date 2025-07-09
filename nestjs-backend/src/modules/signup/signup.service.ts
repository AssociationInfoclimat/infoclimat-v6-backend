import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SignupService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async signup(body: any) {
    try {
    } catch (error) {
        
    }
  }
}
