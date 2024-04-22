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
  UsePipes,
} from '@nestjs/common';

import { LoginDto, ResetPasswordDto, UserDto } from 'src/dto/user.dto';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { SignupValidationPipe } from 'src/pipes/signup-validation.pipe';
import { AuthService } from 'src/service/auth.service';

export const ResponseMessage = (message: string) =>
  SetMetadata('message', message);

@Controller('user')
// @UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(public authService: AuthService) { }

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
  @UsePipes(new SignupValidationPipe())
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
  @ResponseMessage('Password changed successfully')
  @Put('resetPassword')
  async resetPassword(
    @Req() request,
    @Body() resetPasswordDto: ResetPasswordDto
  ) {
    try {
      if (!request.user) {
        throw new HttpException(
          'Unauthorized request',
          HttpStatus.UNAUTHORIZED
        );
      }
      const user = await this.authService.getUser(request.user.id, true);
      const isValidPassword = await this.authService.comparePassword(
        resetPasswordDto.oldPassword,
        user.password
      );
      if (!isValidPassword) {
        throw new HttpException('Invalid old password', HttpStatus.CONFLICT);
      }
      const newPasswordHash = await this.authService.createPasswordHash(
        resetPasswordDto.newPassword
      );
      await this.authService.update(user.id, {
        password: newPasswordHash,
      });
      return;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
