import { IsUUID } from 'class-validator';

export class UUIDValidate {
  @IsUUID('all')
  id: string;
}
