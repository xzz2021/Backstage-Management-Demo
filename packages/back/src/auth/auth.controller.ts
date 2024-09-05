import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: UserLoginDto) {
    const { phone, password } = signInDto;
    return this.authService.signIn(phone, password);
  }
}
