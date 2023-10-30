import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', { exclude: ['health'] });
  app.enableCors({ origin: ['http://localhost:3000'], credentials: true, exposedHeaders: ['Authorization'] });

  await app.listen(port);
  console.log(`Server is running on ${port}`);
}

bootstrap();
