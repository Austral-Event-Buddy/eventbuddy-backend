import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Constants} from "./utils/constants";
import {Logger} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Constants.PORT);
}
bootstrap().then(() => Logger.log(`NestJS server listening at port ${Constants.PORT}`, 'Bootstrap'));
