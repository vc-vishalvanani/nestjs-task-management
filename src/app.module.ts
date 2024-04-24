import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controller/auth.controller';
import { DateController } from './controller/date.controller';
import { TaskController } from './controller/task.controller';
import { TaskSchema } from './schema/task.schema';
import { UserSchema } from './schema/user.schema';
import { AuthService } from './service/auth.service';
import { TaskService } from './service/task.service';
import { TaskModule } from './task/task.module';

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
    TaskModule,
  ],
  controllers: [AppController, TaskController, AuthController, DateController],
  providers: [
    AppService,
    TaskService,
    AuthService,
    // {
    //   provide: TaskService,
    //   useClass: TaskMockService,
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
})
export class AppModule { }
