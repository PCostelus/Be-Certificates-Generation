import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn({ type: 'timestamp' })
  public created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude()
  public updated_at: Date;
}
