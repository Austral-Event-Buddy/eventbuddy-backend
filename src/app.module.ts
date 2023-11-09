import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './domains/health/health.module';
import { AuthModule } from './domains/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './domains/user/user.module';
import { EventModule } from './domains/event/event.module';
import { ElementModule } from "./domains/element/element.module";
import { CommentModule } from "./domains/comment/comment.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UserModule,
    EventModule,
    ElementModule,
    CommentModule,
  ],
})
export class AppModule {}
