import {
  Get,
  Controller,
  Param,
  Inject,
  Post,
  Body,
  Patch,
} from '@nestjs/common';

import { Return } from 'src/common/entities/return.class';
import { UUIDValidate } from 'src/common/entities/uuidValidate.class';
import { CreateFacultyDto } from './classes/createFaculty.dto';
import { UpdateFacultyDto } from './classes/updateFaculty.dto';
import { Faculty } from './faculty.entity';
import { FacultyService } from './faculty.service';

@Controller('api/faculty')
export class FacultyController {
  @Inject(FacultyService)
  private readonly facultyService: FacultyService;

  @Get(':id')
  public getFaculty(@Param() id: UUIDValidate): Promise<Faculty | Return> {
    return this.facultyService.getFaculty(id);
  }

  @Get()
  public listFaculties(): Promise<Faculty[] | Return> {
    return this.facultyService.listFaculties();
  }

  @Post()
  public createFaculty(
    @Body() body: CreateFacultyDto,
  ): Promise<Faculty | Return> {
    return this.facultyService.createFaculty(body);
  }

  @Patch(':id')
  public updateFaculty(
    @Param() id: UUIDValidate,
    @Body() updateFacultyData: UpdateFacultyDto,
  ): Promise<Return> {
    return this.facultyService.updateFaculty(id, updateFacultyData);
  }
}
