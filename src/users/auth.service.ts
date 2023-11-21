import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as buffer from "buffer";
import { scrypt as _scrypt,randomBytes } from "crypto";
import { promisify } from "util";

import { UsersService } from "./users.service";

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const user = await this.usersService.find(email);
    if (user.length) {
      throw new BadRequestException("email in use");
    }
    const salt = randomBytes(8).toString("hex");
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashadPassword = salt + "." + hash.toString("hex");

    const newUser = await this.usersService.create({
      email,
      password: hashadPassword,
    });

    return newUser;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException("password or email is not correct");
    }

    const [salt, storedHash] = user.password.split(".");
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString("hex")) {
      throw new NotFoundException("password or email is not correct");
    }

    return user;
  }
}
