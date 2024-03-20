import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { LoginDto, ResetPasswordDto, UserDto } from 'src/dto/user.dto';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { AuthService } from 'src/service/auth.service';

@Controller('user')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(AuthGuard)
  @Get(':id')
  async userById(@Req() request, @Param('id') id: string) {
    try {
      const userData = await this.authService.findById(id);
      // Set response message for this specific request
      request.responseMessage = 'User found successfully';
      return userData;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() request) {
    try {
      const userData = await this.authService.findAll();
      // Set response message for this specific request
      request.responseMessage = 'All user data found successfully';
      return userData;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Post('signup')
  async signup(@Req() request, @Body() registerUserDTO: UserDto) {
    try {
      await this.authService.findByUserName(registerUserDTO.username);
      registerUserDTO.password = await this.authService.createPasswordHash(
        registerUserDTO.password
      );
      const newUser = await this.authService.create(registerUserDTO);
      // Set response message for this specific request
      request.responseMessage = 'User created successfully';
      return newUser;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Post('login')
  async login(@Req() request, @Body() loginUserDto: LoginDto) {
    try {
      const token = await this.authService.login(loginUserDto);
      // Set response message for this specific request
      request.responseMessage = 'Logged in successfully';
      return {
        token,
      };
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @UseGuards(AuthGuard)
  @Put('resetPassword')
  async resetPassword(
    @Req() request,
    @Body() resetPasswordDto: ResetPasswordDto
  ) {
    try {
      if (!request.user) {
        request.responseMessage = 'Unauthorized request';
        request.statusCode = HttpStatus.UNAUTHORIZED;
        return;
      }
      const user = await this.authService.getUser(request.user.id, true);
      const isValidPassword = await this.authService.comparePassword(
        resetPasswordDto.oldPassword,
        user.password
      );
      if (!isValidPassword) {
        request.responseMessage = 'Invalid old password';
        request.statusCode = HttpStatus.CONFLICT;
        return;
      }
      const newPasswordHash = await this.authService.createPasswordHash(
        resetPasswordDto.newPassword
      );
      await this.authService.update(user.id, {
        password: newPasswordHash,
      });
      request.responseMessage = 'Password changed successfully';
      request.statusCode = HttpStatus.OK;
      return;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
