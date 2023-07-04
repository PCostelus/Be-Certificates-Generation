import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faculty } from 'src/faculties/faculty.entity';
import { User } from 'src/users/user.entity';
import { CertificateController } from './certificate.controller';
import { Certificate } from './certificate.entity';
import { CertificateService } from './certificate.service';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, Faculty, User])],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModel {}
