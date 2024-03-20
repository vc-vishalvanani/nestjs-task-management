import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcrypt';
import { Model } from 'mongoose';

import { LoginDto, UpdateUserDto, UserDto } from 'src/dto/user.dto';
import { IUser } from 'src/interface/user.interface';

@Injectable()
export class AuthService {
  saltRounds = 8;

  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    private jwtService: JwtService
  ) { }

  async create(createUserDto: UserDto) {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findById(id: string): Promise<IUser> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (err) {
      throw new NotFoundException({
        message: err.message,
      });
    }
  }

  async findAll(): Promise<IUser[]> {
    const userList = await this.userModel.find();
    if (!userList || userList.length === 0) {
      throw new NotFoundException('User list is empty.');
    }
    return userList;
  }

  async findByUserName(username: string) {
    const user = await this.userModel.findOne({ username }).exec();
    if (user) {
      throw new NotFoundException('Username already in use.');
    }
  }

  async login(loginUserDto: LoginDto) {
    // Check username
    const queryRes = this.userModel.findOne({
      username: loginUserDto.username,
    });
    const user = await queryRes.select('+password').exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credential.');
    }

    // check password validation
    const validPassword = await this.comparePassword(
      loginUserDto.password,
      user.password
    );
    if (!validPassword) {
      throw new UnauthorizedException('Unauthorized credential.');
    }
    const payload = {
      id: user._id,
      name: user.name,
      username: user.userName,
    };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async update(id: string, updateObject: UpdateUserDto) {
    const updateRes = await this.userModel.findByIdAndUpdate(id, updateObject);

    if (!updateRes) {
      throw new NotFoundException('User not found');
    }
    return updateRes;
  }

  async getUser(userId: string, isIncludePassword = false) {
    const queryRes = this.userModel.findById(userId);
    return isIncludePassword
      ? await queryRes.select('+password').exec()
      : await queryRes.exec();
  }

  // check password validation
  async comparePassword(password: string, dbPassword: string) {
    return await compare(password, dbPassword);
  }

  async createPasswordHash(password: string) {
    return await hash(password, 10);
  }
}
