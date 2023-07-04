import { HttpStatus, Injectable } from '@nestjs/common';
import { Return } from 'src/common/entities/return.class';
import { User } from 'src/users/user.entity';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/classes/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(
    loginPayload: LoginUserDto,
  ): Promise<User | Return> {
    const user = await this.userService.findUserByEmail(
      loginPayload.email_address,
    );

    console.log(user);

    let hasValidPassword = false;
    if (user) {
      hasValidPassword = await loginPayload.validatePassword(user);
    }
    if (user && hasValidPassword) {
      return user;
    }
    return new Return(
      HttpStatus.UNAUTHORIZED,
      'The user is not authorized to perform any action',
      'Unauthorized',
    );
  }

  public async login(user: User) {
    const payload = {
      userId: user.id,
      email_address: user.email_address,
      role: user.role,
      faculty: user?.faculty?.id || null,
      first_name: user.first_name,
      last_name: user.last_name,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
