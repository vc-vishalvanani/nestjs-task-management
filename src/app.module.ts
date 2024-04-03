import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controller/auth.controller';
import { TaskController } from './controller/task.controller';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { TaskMockService } from './mock/task-mock.service';
import { TaskSchema } from './schema/task.schema';
import { UserSchema } from './schema/user.schema';
import { AuthService } from './service/auth.service';
import { TaskService } from './service/task.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      { name: 'Task', schema: TaskSchema },
      { name: 'User', schema: UserSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
    }),
  ],
  controllers: [AppController, TaskController, AuthController],
  providers: [
    AppService,
    TaskService,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: TaskService,
      useClass: TaskMockService,
    },
  ],
})
export class AppModule { }
