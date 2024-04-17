import { Injectable, NotFoundException, Param } from '@nestjs/common';

@Injectable()
export class TaskMockService {
  taskList = [
    {
      id: 1,
      name: 'Development',
      type: 'development',
      version: 4,
      uuid: 'd0759fcf-9b3a-465b-ae17-3a83f25d6543',
    },
    {
      id: 2,
      name: 'Deployment',
      type: 'deployment',
      version: 4,
      uuid: '611cf906-c912-40eb-aeab-95f0effeac5e',
    },
  ];

  findAll() {
    return this.taskList;
  }

  // findOne(@Param('id', new ParseUUIDPipe()) uuid: string) {
  //   return this.taskList.find((task) => task.uuid == uuid);
  // }
  findOne(@Param('id') id: number) {
    const task = this.taskList.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }
}
