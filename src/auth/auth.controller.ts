import {
  Controller,
  Post,
  UseGuards,
  Request,
  Inject,
  HttpCode,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';

@Controller('api/auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Request() loginPayload: any) {
    return this.authService.login(loginPayload.user);
  }
}
