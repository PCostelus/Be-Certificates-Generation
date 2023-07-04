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
import { Faculty } from './faculty.entity';
import { CreateFacultyDto } from './classes/createFaculty.dto';
import { isEmpty } from 'src/utils';
import { UpdateFacultyDto } from './classes/updateFaculty.dto';

@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  public async getFaculty(facultyId: UUIDValidate): Promise<Faculty | Return> {
    try {
      const faculty = await this.facultyRepository.findOne({
        where: { id: facultyId.id },
      });

      if (!faculty) {
        return new Return(
          HttpStatus.NOT_FOUND,
          'Faculty does not exist',
          'Not found',
        );
      }

      return faculty;
    } catch (err) {
      console.log('Error on getting a faculty: ', err);
      return new Return(HttpStatus.BAD_REQUEST, err.message, 'Bad request');
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  public async createFaculty(
    facultyData: CreateFacultyDto,
  ): Promise<Faculty | Return> {
    return this.facultyRepository.save(
      this.facultyRepository.create(facultyData),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  public async listFaculties(): Promise<Faculty[] | Return> {
    try {
      const faculties = await this.facultyRepository.find();

      if (faculties.length === 0) {
        return new Return(
          HttpStatus.NOT_FOUND,
          'There are no faculties',
          'Not found',
        );
      }

      for (let i = 0; i < faculties.length; i++) {
        faculties[i]['status'] =
          faculties[i].study_domains.length > 0 &&
          faculties[i].study_programs.length &&
          faculties[i].faculty_acronym &&
          faculties[i].end_year &&
          faculties[i].start_year
            ? 'complet'
            : 'incomplet';
      }

      console.log(faculties);

      return faculties;
    } catch (err) {
      console.log('Error on listing all the faculties: ', err);
      return new Return(HttpStatus.BAD_REQUEST, err.message, 'Bad request');
    }
  }

  public async updateFaculty(
    facultyId: UUIDValidate,
    facultyData: UpdateFacultyDto,
  ): Promise<Return> {
    const faculty = await this.facultyRepository.findOne({
      where: { id: facultyId.id },
    });
    if (isEmpty(faculty)) {
      return new Return(
        HttpStatus.NOT_FOUND,
        'Faculty does not exist',
        'Not Found',
      );
    }
    await this.facultyRepository.update(facultyId.id, facultyData);
    return new Return();
  }
}
