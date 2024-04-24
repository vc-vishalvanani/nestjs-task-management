import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from 'src/controller/auth.controller';
import {
  UserAgentMiddleware,
  UserAgentOptions,
} from 'src/middleware/user-agent.middleware';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: UserAgentOptions,
      useValue: {
        accepted: ['chrome', 'firefox', 'safari', 'postman'],
      },
    },
  ],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAgentMiddleware)
      .forRoutes({ path: 'task/*', method: RequestMethod.GET }, AuthController);
  }
}
