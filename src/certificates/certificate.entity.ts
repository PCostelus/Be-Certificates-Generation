import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { EnumStudyYear } from './classes/certificate.enum';

@Entity('certificate')
export class Certificate extends AbstractEntity {
  @Column()
  study_domain: string;

  @Column()
  study_program: string;

  @Column({ type: 'enum', enum: EnumStudyYear, default: EnumStudyYear.YEAR_I })
  study_year: EnumStudyYear;

  @Column()
  reason: string;

  @Column()
  financial_status: string;

  @Column()
  registration_number: string;

  @Column()
  registration_date: string;

  @Column('bool', { nullable: true })
  decan_signature: boolean;

  @Column('bool', { nullable: true })
  head_secretary_signature: boolean;

  @Column('bool', { nullable: true })
  secretary_signature: boolean;

  @ManyToOne(() => User, (user) => user.certificates)
  user: User;
}
