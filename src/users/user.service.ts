import {
  ClassSerializerInterceptor,
  HttpStatus,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Return } from 'src/common/entities/return.class';
import { UUIDValidate } from 'src/common/entities/uuidValidate.class';
import { isEmpty } from 'src/utils';
import { User } from './user.entity';
import { CreateUserDto } from './classes/createUser.dto';
import { EnumRole } from './classes/user.enum';
import { UpdateUserDto } from './classes/updateUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  public async createUser(userData: CreateUserDto): Promise<User | Return> {
    return this.userRepository.save(this.userRepository.create(userData));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  public async listProfessors(): Promise<User[] | Return> {
    try {
      const professors = await this.userRepository.find({
        where: [
          { role: EnumRole.DECAN },
          { role: EnumRole.HEAD_SECRETARY },
          { role: EnumRole.SECRETARY },
        ],
        relations: ['faculty'],
      });

      if (professors.length === 0) {
        return new Return(
          HttpStatus.NOT_FOUND,
          'There are no professors',
          'Not found',
        );
      }
      return professors;
    } catch (err) {
      console.log('Error on listing all the professors: ', err);
      return new Return(HttpStatus.BAD_REQUEST, err.message, 'Bad request');
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  public async listStudents(): Promise<User[] | Return> {
    try {
      const students = await this.userRepository.find({
        where: [{ role: EnumRole.STUDENT }],
        relations: ['faculty'],
      });

      if (students.length === 0) {
        return new Return(
          HttpStatus.NOT_FOUND,
          'There are no students',
          'Not found',
        );
      }
      return students;
    } catch (err) {
      console.log('Error on listing all the students: ', err);
      return new Return(HttpStatus.BAD_REQUEST, err.message, 'Bad request');
    }
  }

  public async updateProfessor(
    userId: UUIDValidate,
    userData: UpdateUserDto,
  ): Promise<Return> {
    const user = await this.userRepository.findOne({
      where: { id: userId.id },
    });
    if (isEmpty(user)) {
      return new Return(
        HttpStatus.NOT_FOUND,
        'User does not exist',
        'Not Found',
      );
    }
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 8);
    }
    await this.userRepository.update(userId.id, userData);
    return new Return();
  }

  public async deleteProfessor(userId: UUIDValidate): Promise<Return> {
    const user = await this.userRepository.findOne({
      where: { id: userId.id },
    });
    if (isEmpty(user)) {
      return new Return(
        HttpStatus.NOT_FOUND,
        'User does not exist',
        'Not Found',
      );
    }
    await this.userRepository.delete(userId.id);
    return new Return();
  }

  public async uploadStudents(userData: UpdateUserDto[]): Promise<Return> {
    for (const user of userData) {
      await this.userRepository.save(this.userRepository.create(user));
    }

    return new Return();
  }

  public async findUserByEmail(email_address: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email_address },
      relations: ['faculty'],
    });
  }
}
