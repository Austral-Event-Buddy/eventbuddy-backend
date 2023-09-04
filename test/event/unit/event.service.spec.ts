import { EventService, IEventService } from "../../../src/domains/event/service";
import { IEventRepository } from "../../../src/domains/event/repository";
import { Test, TestingModule } from "@nestjs/testing";
import { EventRepositoryUtil } from "../util/event.repository.util";
import { NewEventInput } from "../../../src/domains/event/input";
import { Event } from "@prisma/client";

describe('EventService Unit Test', () => {
	let eventService: IEventService;
	let eventRepository: IEventRepository;

	beforeEach(async () => {
		const eventServiceProvider = {
			provide: IEventService,
			useClass: EventService,
		}
		const eventRepositoryProvider = {
			provide: IEventRepository,
			useClass: EventRepositoryUtil,
		}
		const app: TestingModule = await Test.createTestingModule({
			imports: [],
			providers: [
				eventRepositoryProvider,
				eventServiceProvider,
			],
		})
			.compile();
		eventService = app.get<IEventService>(IEventService);
		eventRepository = app.get<IEventRepository>(IEventRepository);
	});
	it('Create event', () => {
		const userId = 1;
		const input : NewEventInput = {
			name: 'test',
			description: 'test',
			coordinates: [1, 2],
			confirmationDeadline: undefined,
			date: undefined,
		};
		const event : Event = {
			id: 1,
			name: input.name,
			description: input.description,
			creatorId: userId,
			coordinates: input.coordinates,
			confirmationDeadline: input.confirmationDeadline,
			createdAt: undefined,
			updatedAt: undefined,
			date: input.date,
		};
		const result = eventRepository.createEvent(userId, input);
		expect(result).toEqual(event);
	})

	describe('Get events', () => {
		it.todo('should get events by user id');
	})
	describe('Search event by name or description', () => {
		it.todo('should throw event info where the string matches name or description');
	})

	describe('Update event', () => {
		it.todo('Update event');
	})
	describe('Delete event', () => {
		it.todo('Delete event');
	})
});