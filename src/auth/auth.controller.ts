import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dts';
import { GetUser } from 'src/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }
  @Post('/register')
  singUp(@Body() authDto: AuthDto) {
    return this.authService.registerUser(authDto);
  }
  @Post('/renewToken')
  @UseGuards(AuthGuard('jwt'))
  renewToken(@GetUser() user) {
    return this.authService.renewToken(user);
  }
}
