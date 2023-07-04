import { User } from 'src/users/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../common/entities/abstract.entity';

@Entity('faculty')
export class Faculty extends AbstractEntity {
  @Column()
  faculty_name: string;

  @Column()
  faculty_acronym: string;

  @Column('integer')
  start_year: number;

  @Column('integer')
  end_year: number;

  @Column('text', { array: true })
  study_domains: string[];

  @Column('text', { array: true })
  study_programs: string[];

  @OneToMany(() => User, (user) => user.id)
  users: User[];
}
