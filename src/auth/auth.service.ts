import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './dto/schema/User.interface';
import { AuthDtoRegister, AuthDto } from './dto/auth.dts';
import * as bcrypt from 'bcrypt';
import { JWtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Users') private authModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(authDto: AuthDtoRegister) {
    const { username, password, email } = authDto;
    const getUser = await this.authModel.findOne({ username, email });
    if (getUser) {
      new UnauthorizedException('user already exist');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new this.authModel({
      username,
      password: hashedPassword,
    });
    try {
      return await user.save();
    } catch (error) {
      console.log(error);
      return new UnauthorizedException('something went wrong');
    }
  }
  async signIn(authCredentialDto: AuthDto): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialDto;

    const user = await this.authModel.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      return this.userToReturn(user);
    } else {
      throw new UnauthorizedException('please check your login credential');
    }
  }

  async getOneUser(username: string): Promise<User> {
    return await this.authModel.findOne({ username });
  }
  async renewToken(user: User) {
    return this.userToReturn(user);
  }
  async userToReturn(user: User) {
    const payload: JWtPayload = { username: user.username };
    const accessToken: string = await this.jwtService.sign(payload);
    return {
      accessToken,
    };
  }
}
