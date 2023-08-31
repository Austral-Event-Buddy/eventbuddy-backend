import {Module} from '@nestjs/common';
import {EventController} from './event.controller';
import {EventService} from './event.service';
import {EventRepository} from './event.repository';
import {JwtStrategy} from "../auth/auth.guard";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {AuthService} from "../auth/service/auth.service";
import {AuthRepository} from "../auth/repository/auth.repository";

@Module({

    controllers: [EventController],
    providers: [EventService, EventRepository, JwtStrategy,ConfigService,AuthService, AuthRepository, JwtService],
})
export class EventModule {
}
