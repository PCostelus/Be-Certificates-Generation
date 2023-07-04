import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginUserDto } from 'src/users/classes/loginUser.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email_address' });
  }

  async validate(username: string, password: string): Promise<User> {
    const loginUserDto = new LoginUserDto(username, password);

    const user = await this.authService.validateUser(loginUserDto);
    if ('error' in user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
