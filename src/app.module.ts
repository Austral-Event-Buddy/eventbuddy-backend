import {Module} from '@nestjs/common';
import {HealthModule} from "./domains/health/health.module";
import {AuthModule} from "./domains/auth/auth.module";
import {ConfigModule} from "@nestjs/config";
import {PrismaModule} from "./prisma/prisma.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        HealthModule,
        AuthModule,
    ],
})
export class AppModule {}
