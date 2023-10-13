import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = 3001;
  const app = await NestFactory.create(AppModule);
  console.log(`DB connection`);

  await app.listen(port);
  console.log(`Server is running on ${port}`);
}
bootstrap();
