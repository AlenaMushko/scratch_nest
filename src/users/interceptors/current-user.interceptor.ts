import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";

import { UsersService } from "../users.service";

@Injectable() //означає, що його можна ін'єктувати в інші класи через їх конструктори.
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);
      request.currentUser = user; // щоб отримати юзера в декораторі CurrentUser
    }
    return handler.handle();
  }
}
