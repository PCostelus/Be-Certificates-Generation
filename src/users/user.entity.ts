import { Faculty } from 'src/faculties/faculty.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { EnumRole } from './classes/user.enum';

@Entity('user')
export class User extends AbstractEntity {
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email_address: string;

  @Column({ nullable: true })
  father_initial: string;

  @Column({ type: 'enum', enum: EnumRole, default: EnumRole.STUDENT })
  role: EnumRole;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  study_program: string;

  @Column({ nullable: true })
  study_domain: string;

  @Column({ nullable: true })
  financial_status: string;

  @Column({ nullable: true })
  study_year: string;

  @Column({ nullable: true })
  password: string;

  @ManyToOne(() => Faculty, (faculty) => faculty.users)
  faculty: Faculty;
}
