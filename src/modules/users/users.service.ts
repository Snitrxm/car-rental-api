import { Injectable } from '@nestjs/common';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async findOne(data: FindOneOptions<User>) {
    return await this.usersRepository.findOne(data);
  }

  public async create(data: DeepPartial<User>) {
    const user = this.usersRepository.create(data);

    await this.usersRepository.save(user);

    return user;
  }
}
