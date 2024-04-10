import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//import cookieParser from 'cookie-parser';
import { Request } from 'express';
import csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist:true}))
  app.enableCors({
    credentials:true,
    origin:["http://localhost:3000"],
  });
 app.use(
  csurf({
    cookie:{
      httpOnly: true,
      sameSite: "none",
      secure: false,
    },
    value: (req: Request) => {
      return req.header("csrf-token")},
  })
 )
  await app.listen( process.env.PORT|| 3005);
}
bootstrap();
