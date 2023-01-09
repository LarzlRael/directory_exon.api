import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dts';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Res() res: Response, @Body() authDto: AuthDto) {
    const response = await this.authService.signIn(authDto);
    res.json({
      ok: true,
      token: response,
    });
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
}
