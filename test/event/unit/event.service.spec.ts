import { EventService, IEventService } from "../../../src/domains/event/service";
import { IEventRepository } from "../../../src/domains/event/repository";
import { Test, TestingModule } from "@nestjs/testing";
import { EventRepositoryUtil } from "../util/event.repository.util";
import {getEventsBySearchInput, NewEventInput, updateEventInput} from "../../../src/domains/event/input";
import {Event} from "@prisma/client";

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
	const userId = 1;
	const input : NewEventInput = {
		name: 'test',
		description: 'test',
		coordinates: [1, 2],
		confirmationDeadline: undefined,
		date: undefined,
	};

	it('Create event', async () => {
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
		const result = await eventService.createEvent(userId, input);
		expect(result).toEqual(event);
	})

	describe('Get events', () => {
		it('By user id', async () => {
			const event = {
				name: input.name,
				description: input.description,
				coordinates: input.coordinates,
				date: input.date,
				confirmationDeadline: input.confirmationDeadline,
				confirmationStatus: {confirmationStatus: 'HOST'},
				guestCount: 1,
			};
			await eventService.createEvent(userId, input);
			const result = await eventService.getEventsByUserId(userId);
			expect(result).toEqual([event]);
		})
		it('By name or description', async () => {
			const event = {
				name: input.name,
				description: input.description,
				coordinates: input.coordinates,
				date: input.date,
				confirmationDeadline: input.confirmationDeadline,
				confirmationStatus: {confirmationStatus: 'HOST'},
				guestCount: 1,
			};
			await eventService.createEvent(userId, input);
			const searchInput : getEventsBySearchInput = { search: 't', }
			const result = await eventService.getEventsByNameOrDescriptionAndUserId(userId, searchInput);
			expect(result).toEqual([event]);
		})
	})

	describe('Update event', () => {
		it('Update name', async () => {
			const event = await eventService.createEvent(userId, input);
			const updateInput : updateEventInput = {
				name : 'new test name',
				description: undefined,
				coordinates: undefined,
				confirmationDeadline: undefined,
				date: undefined,
			};
			const result = await eventService.updateEvent(event.id, updateInput);
			event.name = input.name;
			expect(result).toEqual(event);
		})
	})

	it('Delete event', async () => {
		const event = await eventService.createEvent(userId, input);
		await eventService.deleteEvent(userId, event.id);
		const result = await eventService.getEventsByUserId(userId);
		expect(result).toEqual([]);
	})

	describe('Check Host Guest', async () => {
		it('correct host guest', async () => {
			const event = await eventService.createEvent(userId, input);
			const result = await eventService.checkGuestStatusOnEvent(userId, event.id);
			expect(result).toEqual(true);
		})
		it('should throw error, incorrect host guest', () => {
			it.todo('');
		});
	})
});