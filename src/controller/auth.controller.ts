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
  SetMetadata,
  UseGuards,
} from '@nestjs/common';

import { LoginDto, ResetPasswordDto, UserDto } from 'src/dto/user.dto';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { AuthService } from 'src/service/auth.service';

export const ResponseMessage = (message: string) =>
  SetMetadata('message', message);
export const ResponseStatusCode = (statusCode: number) =>
  SetMetadata('responseStatusCode', statusCode);

@Controller('user')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(AuthGuard)
  @ResponseMessage('User found successfully')
  @Get(':id')
  async userById(@Param('id') id: string) {
    try {
      const userData = await this.authService.findById(id);
      return userData;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @UseGuards(AuthGuard)
  @ResponseMessage('All user data found successfully')
  @Get()
  async findAll() {
    try {
      const userData = await this.authService.findAll();
      return userData;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @ResponseMessage('User created successfully')
  @Post('signup')
  async signup(@Body() registerUserDTO: UserDto) {
    try {
      await this.authService.findByUserName(registerUserDTO.username);
      registerUserDTO.password = await this.authService.createPasswordHash(
        registerUserDTO.password
      );
      const newUser = await this.authService.create(registerUserDTO);
      const userData = newUser.toJSON();
      delete userData.password;
      return userData;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @ResponseMessage('Logged in successfully')
  @Post('login')
  async login(@Body() loginUserDto: LoginDto) {
    try {
      const token = await this.authService.login(loginUserDto);
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
