import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { hash } from 'bcrypt';

import { LoginDto, UserDto } from 'src/dto/user.dto';
import { IUser } from 'src/interface/user.interface';
import { AuthService } from 'src/service/auth.service';

@Controller('user')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  async signup(@Res() response, @Body() registerUserDTO: UserDto) {
    try {
      await this.authService.findByUserName(registerUserDTO.username);
      registerUserDTO.password = await hash(registerUserDTO.password, 10);
      const newUser = await this.authService.create(registerUserDTO);
      return response.status(HttpStatus.OK).json({
        message: 'User created successfully',
        data: newUser,
      });
    } catch (err) {
      return response.status(err.status).json({
        message: err.message,
      });
    }
  }

  @Get(':id')
  async findOne(@Res() response, @Param('id') id: string): Promise<IUser> {
    try {
      const userData = await this.authService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message: 'User found successfully',
        data: userData,
      });
    } catch (err) {
      return response.status(err.status).json({
        message: err.message,
      });
    }
  }

  @Get()
  async findAll(@Res() response): Promise<IUser[]> {
    try {
      const userData = await this.authService.findAll();
      return response.status(HttpStatus.OK).json({
        message: 'All user data found successfully',
        userData,
      });
    } catch (err) {
      return response.status(err.status).json({
        message: err.message,
      });
    }
  }

  @Post('login')
  async login(@Res() response, @Body() loginUserDto: LoginDto) {
    try {
      const token = await this.authService.login(loginUserDto);
      return response.status(HttpStatus.OK).json({
        message: 'Logged in successfully',
        access_token: token,
      });
    } catch (err) {
      return response.status(err.status).json({
        message: err.message,
      });
    }
  }
}
