import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UpdateTaskDto } from 'src/dto/update-task.dto';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { ITask } from 'src/interface/task.interface';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskService } from '../service/task.service';

@Controller('task')
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
  async findAll(@Req() request, @Query() queryParams: any) {
    try {
      const taskData = await this.taskService.findAll(queryParams);
      // Set response message for this specific request
      request.responseMessage = 'All task data found successfully';
      return taskData;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() request, @Body() createTaskDto: CreateTaskDto) {
    try {
      const newTask = await this.taskService.create(createTaskDto);
      request.responseMessage = 'Task has been created successfully';
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
