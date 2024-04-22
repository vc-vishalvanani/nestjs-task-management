import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateTaskDto } from 'src/dto/create-task.dto';

@Injectable()
export class TaskValidationPipe implements PipeTransform {
  async transform(value: any) {
    const object = plainToClass(CreateTaskDto, value);
    const errors = await validate(object, { stopAtFirstError: true });

    if (errors.length > 0) {
      const errorMessage = errors
        .map((error) => Object.values(error.constraints))
        .join(', ');
      throw new BadRequestException(errorMessage);
    }

    return value;
  }
}
