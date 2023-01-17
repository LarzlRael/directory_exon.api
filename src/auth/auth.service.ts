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

  async registerUser(authDto: AuthDto) {
    const { username, password } = authDto;
    const getUser = await this.authModel.findOne({ username });
    if (getUser) {
      new UnauthorizedException('user already exist');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassowrd = await bcrypt.hash(password, salt);

    const user = new this.authModel({
      username,
      password: hashedPassowrd,
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
      return this.userToReturn(user.username);
    } else {
      throw new UnauthorizedException('please check your login credential');
    }
  }

  async getOneUser(username: string): Promise<User> {
    const user = await this.authModel.findOne({ username });
    return user;
  }
  async renewToken(User: User) {
    return this.userToReturn(User.username);
  }
  async userToReturn(userName) {
    const payload: JWtPayload = { username: userName };
    const accessToken: string = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
