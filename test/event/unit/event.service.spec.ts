import { EventService, IEventService } from '../../../src/domains/event/service';
import { IEventRepository } from '../../../src/domains/event/repository';
import { Test, TestingModule } from '@nestjs/testing';
import { EventRepositoryUtil } from '../util/event.repository.util';
import {
	getEventsBySearchInput,
	inviteGuestInput,
	NewEventInput,
	updateEventInput
} from '../../../src/domains/event/input';
import { Event } from '@prisma/client';

describe('EventService Unit Test', () => {
	let eventService: IEventService;

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
	});
	const userId = 1;
	const guestId = 2;
	const input : NewEventInput = {
		name: 'test',
		description: 'test',
		coordinates: [1, 2],
		confirmationDeadline: undefined,
		date: undefined,
	};
	const inviteGuestInput : inviteGuestInput = {
		eventId: 1,
		userId: guestId
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
		it('with no events', async () => {
			const searchInput : getEventsBySearchInput = { search: 't', }
			const result = await eventService.getEventsByNameOrDescriptionAndUserId(userId, searchInput);
			expect(result).toEqual([]);
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

	describe('Check Host Guest', () => {
		it('correct host guest', async () => {
			const event = await eventService.createEvent(userId, input);
			const result = await eventService.checkGuestStatusOnEvent(userId, event.id);
			expect(result).toEqual(true);
		})
		// it('should throw error, incorrect host guest', async () => {
		// 	const event = await eventService.createEvent(userId, input);
		// 	await eventService.inviteGuest(inviteGuestInput, userId);
		// 	const result = await eventService.checkGuestStatusOnEvent(guestId, event.id);
		// 	expect(result).toThrow('User is not hosting this event');
		// });
	})
	describe('Invite Guest', () => {
		it('Guest', async () => {
			const event = await eventService.createEvent(userId, input);
			const result = await eventService.inviteGuest(inviteGuestInput, userId);
			expect(result).toEqual({
				id: guestId,
				userId: guestId,
				eventId: event.id,
				confirmationStatus: 'PENDING',
			});
		})
		// it('invite host', async () => {
		// 	const event = await eventService.createEvent(userId, input);
		// 	inviteGuestInput.userId = userId
		// 	const result = await eventService.inviteGuest(inviteGuestInput, userId);
		// 	expect(result).toEqual('The user is already invited to this event');
		// })
	})

	// describe('Answer Invite', () => {
	// 	it('Guest answer HOST', async () => {
	// 		const answerInviteInput = {
	// 			guestId: guestId,
	// 			answer: "ATTENDING",
	// 		}
	// 		const event = await eventService.createEvent(userId, input);
	// 		await eventService.inviteGuest(inviteGuestInput, userId);
	// 		const result = await eventService.answerInvite(answerInviteInput, guestId);
	//
	// 		expect(result).toEqual({
	// 			id: guestId,
	// 			userId: guestId,
	// 			eventId: event.id,
	// 			confirmationStatus: 'PENDING',
	// 		});
	// 	})
	// })

	describe('Get Invites By User', () => {
		it("get host's invite", async () => {
			const event = await eventService.createEvent(userId, input);
			await eventService.inviteGuest(inviteGuestInput, userId);
			const result = await eventService.getInvitesByUser(userId);

			expect(result).toEqual([{
				id: userId,
				userId: userId,
				eventId: event.id,
				confirmationStatus: 'HOST',
			}]);
		})
		it("get host's invite", async () => {
			const event = await eventService.createEvent(userId, input);
			await eventService.inviteGuest(inviteGuestInput, userId);
			const result = await eventService.getInvitesByUser(guestId);

			expect(result).toEqual([{
				id: guestId,
				userId: guestId,
				eventId: event.id,
				confirmationStatus: 'PENDING',
			}]);
		})
	})

	describe('Get Guests By Event', () => {
		it("get host's invite", async () => {
			const event = await eventService.createEvent(userId, input);
			await eventService.inviteGuest(inviteGuestInput, userId);
			const result = await eventService.getGuestsByEvent(event.id);

			expect(result).toEqual([{
				id: userId,
				userId: userId,
				eventId: event.id,
				confirmationStatus: 'HOST',
			}, {
				id: guestId,
				userId: guestId,
				eventId: event.id,
				confirmationStatus: 'PENDING',
			}]);
		})
	})
});