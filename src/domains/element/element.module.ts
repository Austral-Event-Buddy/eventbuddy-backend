import { Module } from '@nestjs/common';
import {ElementService} from "./service/element.service";
import {IElementService} from "./service/element.service.interface";
import {IElementRepository} from "./repository/element.repository.interface";
import {ElementRepository} from "./repository/element.repository";
import {ElementController} from "./element.controller"
import {EventService, IEventService} from "../event/service";

const elementServiceProvider = {
	provide: IElementService,
	useClass: ElementService,
};

const elementRepositoryProvider = {
	provide: IElementRepository,
	useClass: ElementRepository,
};

@Module({
	controllers: [ElementController],
	providers: [
		elementServiceProvider,
		elementRepositoryProvider,
	],
})
export class ElementModule {}
