import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacultyController } from './faculty.controller';
import { Faculty } from './faculty.entity';
import { FacultyService } from './faculty.service';

@Module({
  imports: [TypeOrmModule.forFeature([Faculty])],
  controllers: [FacultyController],
  providers: [FacultyService],
})
export class FacultyModel {}
