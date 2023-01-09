import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './dto/schema/User.interface';
import { AuthDto } from './dto/auth.dts';
import * as bcrypt from 'bcrypt';
import { JWtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Users') private authModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(authDto: AuthDto): Promise<boolean> {
    const { username, password } = authDto;
    const salt = await bcrypt.genSalt();
    const hashedPassowrd = await bcrypt.hash(password, salt);

    const user = new this.authModel({
      username,
      password: hashedPassowrd,
    });
    try {
      await user.save();
      return true;
    } catch (error) {
      console.log(error);
      console.log('error linea duplicada');
      return false;
    }
  }
  async signIn(authCredentialDto: AuthDto): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialDto;

    const user = await this.authModel.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JWtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('please check your login credential');
    }
  }

  async getOneUser(username: string): Promise<User> {
    const user = await this.authModel.findOne({ username });
    return user;
  }
}
