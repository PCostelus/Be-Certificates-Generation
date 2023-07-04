import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateFacultyDto {
  @IsOptional()
  @IsString()
  readonly faculty_name: string;

  @IsOptional()
  @IsString()
  readonly faculty_acronym: string;

  @IsOptional()
  @IsNumber()
  readonly start_year: number;

  @IsOptional()
  @IsNumber()
  readonly end_year: number;

  @IsOptional()
  @IsArray()
  study_domains: string[];

  @IsOptional()
  @IsArray()
  study_programs: string[];
}
