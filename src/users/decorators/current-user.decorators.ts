import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    //для отримання HTTP-запиту з контексту виконання
    const request = context.switchToHttp().getRequest();
    return request.currentUser; //отрималии із CurrentUserInterceptor
  },
);
