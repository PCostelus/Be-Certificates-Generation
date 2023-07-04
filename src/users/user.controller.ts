import {
  Get,
  Controller,
  Param,
  Inject,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';

import { Return } from 'src/common/entities/return.class';
import { UUIDValidate } from 'src/common/entities/uuidValidate.class';
import { CreateUserDto } from './classes/createUser.dto';
import { UpdateUserDto } from './classes/updateUser.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Get('/professors')
  public listProfessors(): Promise<User[] | Return> {
    return this.userService.listProfessors();
  }

  @Post()
  public createUser(@Body() body: CreateUserDto): Promise<User | Return> {
    return this.userService.createUser(body);
  }

  @Patch(':id')
  public updateProfessor(
    @Param() id: UUIDValidate,
    @Body() updateUserData: UpdateUserDto,
  ): Promise<Return> {
    return this.userService.updateProfessor(id, updateUserData);
  }

  @Delete(':id')
  public deleteProfessor(@Param() id: UUIDValidate): Promise<Return> {
    return this.userService.deleteProfessor(id);
  }
}
