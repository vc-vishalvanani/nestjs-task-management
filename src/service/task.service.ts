import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ITask } from 'src/interface/task.interface';
import { UpdateTaskDto } from 'src/dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private taskModel: Model<ITask>) {}

  async create(createTaskDto: CreateTaskDto): Promise<ITask> {
    const newTask = await new this.taskModel(createTaskDto);
    return newTask.save();
  }

  async findAll(): Promise<ITask[]> {
    const taskList = await this.taskModel.find();
    if (!taskList || taskList.length === 0) {
      throw new NotFoundException('Task list is empty.');
    }
    return taskList;
  }

  async findOne(id: string): Promise<ITask> {
    const task = await this.taskModel.findById(id);
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<ITask> {
    const existingData = await this.taskModel.findByIdAndUpdate(
      id,
      updateTaskDto,
      { new: true }
    );
    if (!existingData) {
      throw new NotFoundException('Task data not found');
    }
    return existingData;
  }

  async remove(id: string): Promise<ITask> {
    const removedTask = await this.taskModel.findByIdAndDelete(id);
    if (!removedTask) {
      throw new NotFoundException('Task not found');
    }
    return removedTask;
  }
}
