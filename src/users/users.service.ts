import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateUserDto } from "./dtos/create-user.dto";
import { UserEntity } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
  ) {}
  create(dto: CreateUserDto) {
    const { email, password } = dto;
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  async find(email: string) {
    return await this.repo.find({ where: { email } });
  }

  async update(id: string, attrs: Partial<UserEntity>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    Object.assign(user, attrs);
    return await this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return await this.repo.remove(user);
  }
}
