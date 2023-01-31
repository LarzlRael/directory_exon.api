import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDtoRegister, AuthDto } from './dto/auth.dts';
import { GetUser } from '../decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }
  @Post('/register')
  singUp(@Body() authDto: AuthDtoRegister) {
    return this.authService.registerUser(authDto);
  }
  @Post('/renewToken')
  @UseGuards(AuthGuard('jwt'))
  renewToken(@GetUser() user) {
    return this.authService.renewToken(user);
  }
}
