import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { LoginDto, ResetPasswordDto, UserDto } from 'src/dto/user.dto';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { IUser } from 'src/interface/user.interface';
import { AuthService } from 'src/service/auth.service';

@Controller('user')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(AuthGuard)
  @Get(':id')
  async userById(@Res() response, @Param('id') id: string): Promise<IUser> {
    try {
      const userData = await this.authService.findById(id);
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

  @UseGuards(AuthGuard)
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

  @Post('signup')
  async signup(@Res() response, @Body() registerUserDTO: UserDto) {
    try {
      await this.authService.findByUserName(registerUserDTO.username);
      registerUserDTO.password = await this.authService.createPasswordHash(
        registerUserDTO.password
      );
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

  @UseGuards(AuthGuard)
  @Put('resetPassword')
  async resetPassword(
    @Res() response,
    @Req() request,
    @Body() resetPasswordDto: ResetPasswordDto
  ) {
    try {
      if (!request.user) {
        return response.status(404).json({
          message: 'Invalid Request',
        });
      }
      const user = await this.authService.getUser(request.user.id, true);
      const isValidPassword = await this.authService.comparePassword(
        user.password,
        resetPasswordDto.oldPassword
      );
      if (!isValidPassword) {
        return response.status(HttpStatus.CONFLICT).json({
          message: 'Invalid old password',
        });
      }
      const newPasswordHash = await this.authService.createPasswordHash(
        resetPasswordDto.newPassword
      );
      await this.authService.update(user.id, {
        password: newPasswordHash,
      });
      return response.status(HttpStatus.OK).json({
        message: 'Password changed successfully.',
      });
    } catch (err) {
      return response.status(err.status).json({
        message: err.message,
      });
    }
  }
}
