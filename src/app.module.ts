import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from './schema/task.schema';
import { TaskController } from './controller/task.controller';
import { TaskService } from './service/task.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/task'),
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
  ],
  controllers: [AppController, TaskController],
  providers: [AppService, TaskService],
})
export class AppModule {}
