import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  await app.init();
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors({
    allowedHeaders: ['Accept', 'Content-Type', 'Authorization'],
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  await app.listen(port, () => {
    console.log('App is running ->', config.get<string>('BASE_URL'));
  });
}
bootstrap();
