import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { User, UserParams, UserStatus } from 'src/modules/entity-modules/user/user.types';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserDto {
  @IsNumber()
  id: number;

  @IsString()
  pseudo: string;

  @IsArray()
  @IsEnum(UserStatus)
  statuses: UserStatus[];

  @IsObject()
  params: UserParams;

  @IsString()
  profile_picture: string;

  static toDto(user: User): UserDto {
    return {
      id: user.id,
      pseudo: user.pseudo,
      statuses: user.statuses,
      params: user.params,
      profile_picture: user.profilePicture,
    };
  }
}

export class LoginResponseDto {
  @IsString()
  cookie_token: string;

  static toDto(cookieToken: string): LoginResponseDto {
    return {
      cookie_token: cookieToken,
    };
  }
}
