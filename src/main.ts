import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: { randomUUID },
    configurable: false,
    writable: false,
  });
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  const staticFilesPath = path.resolve(__dirname, '..', 'files');
  app.useStaticAssets(staticFilesPath);

  const frontendUrl = configService.get<string>('FRONTEND_URL');
  const origins = [frontendUrl, 'http://localhost:3002'].filter((url): url is string => !!url); // Add localhost:3002 for dev
  console.log('origin :', origins);
  app.enableCors({
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    allowedHeaders: 'Authorization, Content-Type',
  });

  const config = new DocumentBuilder()
    .setTitle('Inaam Bazar')
    .setDescription('All the APIs required for Inaam Bazar')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3001);
}
bootstrap();
