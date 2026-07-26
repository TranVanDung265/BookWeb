import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: any) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = this.userRepository.create({
        ...data,
        password: hashedPassword,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
    return {
      message: 'Xóa thành công',
    };
  }
  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }
}
