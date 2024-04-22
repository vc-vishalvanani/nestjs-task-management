import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import { UpdateTaskDto } from 'src/dto/update-task.dto';
import { HttpExceptionFilter } from 'src/exception/HttpExceptionFilter';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { ResponseInterceptor } from 'src/interceptor/response.interceptor';
import { ITask } from 'src/interface/task.interface';
import { TaskValidationPipe } from 'src/pipes/task-validation.pipe';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskService } from '../service/task.service';
import { ResponseMessage } from './auth.controller';

@Controller('task')
@UseInterceptors(ResponseInterceptor)
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Req() request, @Param('id') id: string) {
    try {
      const taskData = await this.taskService.findOne(id);
      // Set response message for this specific request
      request.responseMessage = 'Task found successfully';
      return taskData;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Req() request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(2), ParseIntPipe) limit: number
  ) {
    try {
      const taskData = await this.taskService.getTasks(page, limit);
      // Set response message for this specific request
      request.responseMessage = 'All task data found successfully';
      return taskData;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @UseGuards(AuthGuard)
  @UsePipes(new TaskValidationPipe())
  @UseFilters(HttpExceptionFilter)
  @ResponseMessage('Task has been created successfully')
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    try {
      const newTask = await this.taskService.create(createTaskDto);
      return newTask;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateTask(
    @Req() request,
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    try {
      const existingTask = await this.taskService.update(taskId, updateTaskDto);
      request.responseMessage = 'Task has been successfully updated';
      return existingTask;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Req() request, @Param('id') id: string): Promise<ITask> {
    try {
      await this.taskService.remove(id);
      request.responseMessage = 'Task deleted successfully';
      return;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
