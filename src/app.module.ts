import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {HealthModule} from './domains/health/health.module';
import {EventModule} from './domains/event/event.module';
import {ConfigModule} from '@nestjs/config';
import {PrismaModule} from './prisma/prisma.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        HealthModule,
        EventModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
