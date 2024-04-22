// signup-validation.pipe.ts

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class SignupValidationPipe implements PipeTransform {
  // constructor(private readonly authService: AuthService) { }
  async transform(value: any) {
    const object = plainToClass(UserDto, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessage = errors
        .map((error) => Object.values(error.constraints))
        .join(', ');
      throw new BadRequestException(errorMessage);
    }

    // const username = value.username;
    // const userExists = await this.authService.findByUserName(username);
    // console.log('userExists: ', userExists);
    // if (userExists) {
    //   throw new BadRequestException('Username already exists');
    // }

    return value;
  }
}
