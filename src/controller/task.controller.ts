import {
  Controller,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  Put,
  Get,
  Delete,
} from '@nestjs/common';
import { TaskService } from '../service/task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { ITask } from 'src/interface/task.interface';
import { UpdateTaskDto } from 'src/dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

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
      return response.status(err.status).json(err.response);
    }
  }

  @Get()
  async findAll(@Res() response): Promise<ITask[]> {
    try {
      const taskData = await this.taskService.findAll();
      return response.status(HttpStatus.OK).json({
        message: 'All task data found successfully',
        taskData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get(':id')
  async findOne(@Res() response, @Param('id') id: string): Promise<ITask> {
    try {
      const taskData = await this.taskService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message: 'Task found successfully',
        data: taskData,
      });
    } catch (err) {
      return response.status(err.status).json(err.message);
    }
  }

  @Delete(':id')
  async remove(@Res() response, @Param('id') id: string): Promise<ITask> {
    try {
      const removedStudent = await this.taskService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: 'Task deleted successfully',
        removedStudent,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
