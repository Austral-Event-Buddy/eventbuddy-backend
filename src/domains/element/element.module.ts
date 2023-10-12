import { Module } from '@nestjs/common';
import {ElementService} from "./service/element.service";
import {IElementService} from "./service/element.service.interface";
import {IElementRepository} from "./repository/element.repository.interface";
import {ElementRepository} from "./repository/element.repository";

const elementServiceProvider = {
	provide: IElementService,
	useClass: ElementService,
};

const elementRepositoryProvider = {
	provide: IElementRepository,
	useClass: ElementRepository,
};

@Module({
	controllers: [ElementRepository],
	providers: [
		elementServiceProvider,
		elementRepositoryProvider,
	],
})
export class EventModule {}
