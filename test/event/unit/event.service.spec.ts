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
import {confirmationStatus, Event} from '@prisma/client';
import { UserService } from '../../../src/domains/user/user.service';
import { UserServiceUtil } from '../../user/util/user.service.util';

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
    const userService = {
      provide: UserService,
      useClass: UserServiceUtil
    }

		const app: TestingModule = await Test.createTestingModule({
			imports: [],
			providers: [
				eventRepositoryProvider,
				eventServiceProvider,
        userService,
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
		confirmationDeadline: new Date(2024, 8, 22),
		date: new Date(2025, 8, 25),
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
				confirmationStatus: 'HOST',
                id: 1,
				guests: 1,
			};
			await eventService.createEvent(userId, input);
			const result = await eventService.getEventsByUserId(userId);
			expect(result).toEqual([event]);
		})
		it('By user id. And the guest will not attend.', async () => {
			const event = await eventService.createEvent(userId, input);
			await eventService.inviteGuest(inviteGuestInput, userId);
			await eventService.answerInvite({
				eventId: event.id,
				answer: confirmationStatus.NOT_ATTENDING,
			}, guestId);
			const result = await eventService.getEventsByUserId(guestId);
			expect(result).toEqual([]);
		})
		it('By name or description', async () => {
			const event = {
				name: input.name,
				description: input.description,
				coordinates: input.coordinates,
				date: input.date,
				confirmationDeadline: input.confirmationDeadline,
				confirmationStatus: 'HOST',
                id: 1,
				guests: 1,
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
            expect(result).not.toEqual(event);
			expect(event.name).toEqual(input.name);
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
	})

	describe('Invite Guest', () => {
		it('invite guest with future dates and confirmation dates', async () => {
			const event = await eventService.createEvent(userId, input);
			const result = await eventService.inviteGuest(inviteGuestInput, userId);
			expect(result).toEqual({
				id: guestId,
				userId: guestId,
				eventId: event.id,
				confirmationStatus: 'PENDING',
			});
		})
	})

	describe('Answer Invite', () => {
		it('Guest answer ATTENDING', async () => {
			const event = await eventService.createEvent(userId, input);
			const answerInviteInput = {
				eventId: event.id,
				answer: confirmationStatus.ATTENDING,
			}
			await eventService.inviteGuest(inviteGuestInput, userId);
			const result = await eventService.answerInvite(answerInviteInput, guestId);

			expect(result).toEqual({
				id: guestId,
				userId: guestId,
				eventId: event.id,
				confirmationStatus: 'ATTENDING',
			});
		})
		it('Guest answer HOST', async () => {
			const event = await eventService.createEvent(userId, input);
			const answerInviteInput = {
				eventId: event.id,
				answer: confirmationStatus.HOST,
			}
			await eventService.inviteGuest(inviteGuestInput, userId);
			const result = await eventService.answerInvite(answerInviteInput, guestId);

			expect(result).toEqual({
				id: guestId,
				userId: guestId,
				eventId: event.id,
				confirmationStatus: 'HOST',
			});
		})
		it('Guest answer PENDING', async () => {
			const event = await eventService.createEvent(userId, input);
			const answerInviteInput = {
				eventId: event.id,
				answer: confirmationStatus.PENDING,
			}
			await eventService.inviteGuest(inviteGuestInput, userId);
			const result = await eventService.answerInvite(answerInviteInput, guestId);

			expect(result).toEqual({
				id: guestId,
				userId: guestId,
				eventId: event.id,
				confirmationStatus: 'PENDING',
			});
		})
		it('Guest answer NOT ATTENDING', async () => {
			const event = await eventService.createEvent(userId, input);
			const answerInviteInput = {
				eventId: event.id,
				answer: confirmationStatus.NOT_ATTENDING,
			}
			await eventService.inviteGuest(inviteGuestInput, userId);
			const result = await eventService.answerInvite(answerInviteInput, guestId);

			expect(result).toEqual({
				id: guestId,
				userId: guestId,
				eventId: event.id,
				confirmationStatus: 'NOT_ATTENDING',
			});
		})
	})

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
