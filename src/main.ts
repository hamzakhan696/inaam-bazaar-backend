import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

// This function will be used by Vercel's serverless handler
export async function createNestServer() {
  const server = express();
  // Create the NestJS app with Express adapter
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Swagger setup (needs Nest app, not Express)
  const config = new DocumentBuilder()
    .setTitle('Inaam Bazaar API')
    .setDescription('APIs for Products, Categories, Lotteries')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init();
  // Return only the Express server for Vercel
  return server;
}

// For local development: run as a normal server
if (require.main === module) {
  (async () => {
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
      .setTitle('Inaam Bazaar API')
      .setDescription('APIs for Products, Categories, Lotteries')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT ?? 3000);
  })();
}
