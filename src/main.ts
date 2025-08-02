import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import './config/dayjs.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: '*', // Ganti sesuai asal frontend
    // credentials: true, // Jika kamu pakai cookies/token auth
  });

  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}
bootstrap();
