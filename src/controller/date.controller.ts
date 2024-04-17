import { Controller, Get, Query, UsePipes } from '@nestjs/common';

import { TransformPipe } from 'src/pipes/transform.pipe';

@Controller('date')
export class DateController {
  @Get()
  @UsePipes(new TransformPipe())
  getDate(@Query('date') date: string) {
    const fullDate = new Date(date);
    return fullDate.toISOString();
  }
}
