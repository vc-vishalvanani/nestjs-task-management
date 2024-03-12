import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { Model } from 'mongoose';

import { LoginDto, UserDto } from 'src/dto/user.dto';
import { IUser } from 'src/interface/user.interface';

@Injectable()
export class AuthService {
  saltRounds = 8;

  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    private jwtService: JwtService
  ) { }

  async create(createUserDto: UserDto): Promise<IUser> {
    const user = await new this.userModel(createUserDto);
    return user.save();
  }

  async findOne(id: string): Promise<IUser> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(): Promise<IUser[]> {
    const userList = await this.userModel.find();
    if (!userList || userList.length === 0) {
      throw new NotFoundException('User list is empty.');
    }
    return userList;
  }

  async findByUserName(userName: string) {
    const user = await this.userModel.find({ username: userName }).exec();
    if (user.length) {
      throw new NotFoundException('Username already in use.');
    }
  }

  async login(loginUserDto: LoginDto) {
    // Check username
    const user = await this.userModel
      .find({
        username: loginUserDto.username,
      })
      .exec();
    if (!user.length) {
      throw new UnauthorizedException('Invalid credential.');
    }

    // check password validation
    const validPassword = await compare(
      loginUserDto.password,
      user[0].password
    );
    if (!validPassword) {
      throw new UnauthorizedException('Unauthorized credential.');
    }
    const payload = {
      id: user[0]._id,
      name: user[0].name,
      username: user[0].userName,
    };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
