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
}
