import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {HealthModule} from "./domains/health/health.module";
import {AuthModule} from "./domains/auth/auth.module";
import {ConfigModule} from "@nestjs/config";
import {PrismaModule} from "./prisma/prisma.module";
import {EventModule} from './domains/event/event.module';
import {UserModule} from "./domains/user/user.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        HealthModule,
        AuthModule,
        EventModule

    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
