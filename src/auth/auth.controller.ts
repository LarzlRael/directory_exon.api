import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dts';
import { Response } from 'express';
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
  async singUp(@Res() res: Response, @Body() authDto: AuthDto) {
    if (await this.authService.registerUser(authDto)) {
      res.json({
        ok: true,
        msg: 'usuario creado correctamente',
      });
    } else {
      res.json({
        ok: false,
        msg: 'Error',
      });
    }
  }
  @Post('/renewToken')
  @UseGuards(AuthGuard('jwt'))
  renewToken(@GetUser() user) {
    return this.authService.renewToken(user);
  }
}
