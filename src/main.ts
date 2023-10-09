import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateDocument } from './doc';
import { RemoveSensitiveUserInfoInterceptor } from './shared/interceptors/remove-sensitive-info.interceptor';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe())

  // 创建文档
  generateDocument(app)

  app.useGlobalInterceptors(new RemoveSensitiveUserInfoInterceptor())
  app.enableCors()
  app.useStaticAssets(join(__dirname, 'images'), {
    prefix: '/res'
  })


  console.log(process.env.staicBaseUrl
  )


  await app.listen(7002);
}
bootstrap();

