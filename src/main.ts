import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 스웨거 도입
  const config = new DocumentBuilder()
    .setTitle('shop-toy-app-server')
    .setDescription('shop-toy-app-server의 스웨거 문서')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // validationPipe 도입
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
