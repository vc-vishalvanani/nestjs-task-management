import {
  BadRequestException,
  Injectable,
  PipeTransform
} from '@nestjs/common';

@Injectable()
export class TransformPipe implements PipeTransform<string, Date> {
  transform(value: string): Date {
    const inputDate = new Date(value);
    if (isNaN(inputDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
    return inputDate;
  }
}
