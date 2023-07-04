import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getEnvPath } from './common/helper/env.helper';

import { FacultyModel } from './faculties/faculty.module';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { UserModel } from './users/user.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    FacultyModel,
    UserModel,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
