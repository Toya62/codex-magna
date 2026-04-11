import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Global ValidationPipe configuration — critical for polymorphic DTO validation.
   *
   * transform: true        — Enables class-transformer. Without this, @Transform()
   *                          decorators in CreatePaginaDto are NEVER called, and
   *                          polymorphic resolution silently fails.
   *
   * whitelist: true        — Strips any properties not declared in the DTO class,
   *                          preventing unknown fields from leaking into JSONB.
   *
   * forbidNonWhitelisted   — Throws a 400 if an unknown property is detected,
   *                          rather than silently stripping it. Strict by default.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Codex Magna is running on: ${await app.getUrl()}`);
}

bootstrap();
