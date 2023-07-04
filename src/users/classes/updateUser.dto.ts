import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { EnumRole } from './user.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly first_name: string;

  @IsOptional()
  @IsString()
  readonly last_name: string;

  @IsOptional()
  @IsString()
  email_address: string;

  @IsOptional()
  @IsString()
  father_initial: string;

  @IsOptional()
  @IsEnum(EnumRole)
  role: EnumRole;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  study_program: string;

  @IsOptional()
  @IsString()
  study_domain: string;

  @IsOptional()
  @IsString()
  financial_status: string;

  @IsOptional()
  @IsString()
  study_year: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string;
}
