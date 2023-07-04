import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFacultyDto {
  @IsNotEmpty()
  @IsString()
  readonly faculty_name: string;

  @IsNotEmpty()
  @IsString()
  readonly faculty_acronym: string;

  @IsNotEmpty()
  @IsNumber()
  readonly start_year: number;

  @IsNotEmpty()
  @IsNumber()
  readonly end_year: number;

  @IsNotEmpty()
  @IsArray()
  study_domains: string[];

  @IsNotEmpty()
  @IsArray()
  study_programs: string[];
}
