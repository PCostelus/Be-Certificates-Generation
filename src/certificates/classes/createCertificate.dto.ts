import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/user.entity';
import { EnumStudyYear } from './certificate.enum';

export class CreateCertificateDto {
  @IsNotEmpty()
  @IsString()
  readonly study_domain: string;

  @IsNotEmpty()
  @IsString()
  readonly study_program: string;

  @IsNotEmpty()
  @IsEnum(EnumStudyYear)
  readonly study_year: EnumStudyYear;

  @IsNotEmpty()
  @IsString()
  readonly reason: string;

  @IsNotEmpty()
  @IsString()
  readonly financial_status: string;

  @IsNotEmpty()
  @IsString()
  readonly faculty_id: string;
}
