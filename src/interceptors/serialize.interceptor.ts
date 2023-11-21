import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";

interface ClassConstructor {
  // б-я клас
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  // створили декоратор для інтерсептора
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {} // універсальне, приймає б-я дто

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true, //видалить всі зайві поля, які не вказані в UserDto
        });
      }),
    );
  }
}
