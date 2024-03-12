import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
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

  @Post()
  async create(@Res() response, @Body() createTaskDto: CreateTaskDto) {
    try {
      const newTask = await this.taskService.create(createTaskDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Task has been created successfully',
        newTask,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Task not created!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateTask(
    @Res() response,
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    try {
      const existingTask = await this.taskService.update(taskId, updateTaskDto);
      return response.status(HttpStatus.OK).json({
        message: 'Task has been successfully updated',
        existingTask,
      });
    } catch (err) {
      return response.status(err.status).json({
        message: err.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Res() response, @Query() queryParams: any): Promise<ITask[]> {
    try {
      const taskData = await this.taskService.findAll(queryParams);
      return response.status(HttpStatus.OK).json({
        message: 'All task data found successfully',
        taskData,
      });
    } catch (err) {
      return response.status(err.status).json({
        message: err.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Res() response, @Param('id') id: string): Promise<ITask> {
    try {
      const taskData = await this.taskService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message: 'Task found successfully',
        data: taskData,
      });
    } catch (err) {
      return response.status(err.status).json({
        message: err.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Res() response, @Param('id') id: string): Promise<ITask> {
    try {
      const removedStudent = await this.taskService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: 'Task deleted successfully',
        removedStudent,
      });
    } catch (err) {
      return response.status(err.status).json({
        message: err.message,
      });
    }
  }
}
