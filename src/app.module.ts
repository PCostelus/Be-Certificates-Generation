import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CertificateModel } from './certificates/certificate.module';

import { getEnvPath } from './common/helper/env.helper';

import { FacultyModel } from './faculties/faculty.module';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { UserModule } from './users/user.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    FacultyModel,
    UserModule,
    AuthModule,
    CertificateModel,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
