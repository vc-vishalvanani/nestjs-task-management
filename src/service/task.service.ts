import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UpdateTaskDto } from 'src/dto/update-task.dto';
import { ITask } from 'src/interface/task.interface';
import { CreateTaskDto } from '../dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private taskModel: Model<ITask>) { }

  async create(createTaskDto: CreateTaskDto) {
    const newTask = new this.taskModel(createTaskDto);
    return newTask.save();
  }

  async findAll(param: any): Promise<ITask[]> {
    const taskList = await this.taskModel.find(param);
    if (!taskList || taskList.length === 0) {
      throw new NotFoundException('Task list is empty.');
    }
    return taskList;
  }

  async findOne(id: number): Promise<ITask> {
    const task = await this.taskModel.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
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
