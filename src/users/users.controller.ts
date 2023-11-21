import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Session,
  UseInterceptors,
} from "@nestjs/common";

import { Serialize } from "../interceptors/serialize.interceptor";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorators";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserDto } from "./dtos/user.dto";
import { CurrentUserInterceptor } from "./interceptors/current-user.interceptor";
import { UsersService } from "./users.service";

@Controller("auth")
@Serialize(UserDto) //віддає без пароля
@UseInterceptors(CurrentUserInterceptor) //поточний юзер із куків
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post("sign-up")
  async signup(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(
      body.email.trim().toLowerCase(),
      body.password.trim(),
    );
    session.userId = user.id;

    return user;
  }

  @Post("sign-in")
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(
      body.email.trim().toLowerCase(),
      body.password.trim(),
    );
    session.userId = user.id;

    return user;
  }

  // @Get("/whoami")
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }

  @Get("/whoami")
  whoAmI(@CurrentUser() user: UserDto) {
    return user;
  }

  @Post("/sign-out")
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Put(":id")
  updateById(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Delete(":id")
  deleteById(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
