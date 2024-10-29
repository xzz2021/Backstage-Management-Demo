import { Body, Controller, Post, Req, UseGuards,Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './auth.dto';
import { Public } from 'src/auth/guard/public';
import { LocalAuthGuard } from './guard/auth.guard';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}



  // signIn(@Body() signInDto: UserLoginDto) {
  //   const { phone, password } = signInDto;
  //   return this.authService.signIn(phone, password);
  // }
  // @Public()
  @UseGuards(LocalAuthGuard)  // LocalAuthGuard此处只是一个别名
  @Post('login')
  signIn(@Request() req: any) {
    //  如果通过了 LocalAuthGuard ，req.user 就包含了所需的用户
    return this.authService.signIn(req.user);
  }
}
