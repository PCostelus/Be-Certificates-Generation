import { Certificate } from 'src/certificates/certificate.entity';
import { Faculty } from 'src/faculties/faculty.entity';
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { EnumRole } from './classes/user.enum';
import * as bcrypt from 'bcrypt';

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

  @Column({ nullable: true })
  cnp: string;

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

  @OneToMany(() => Certificate, (certificate) => certificate.id)
  certificates: Certificate[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) this.password = await bcrypt.hash(this.password, 8);
  }
}
