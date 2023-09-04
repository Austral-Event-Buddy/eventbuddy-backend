import { Injectable } from "@nestjs/common";
import { IEventRepository } from "../../../src/domains/event/repository";
import { NewEventInput } from "../../../src/domains/event/input";
import { Guest, Event } from "@prisma/client";

@Injectable()
export class EventRepositoryUtil implements IEventRepository{
	events: Event[] = [];
	guests: Guest[] = [];
	id = 1;
	guestId = 1;

	createEvent(userId: number, input: NewEventInput): Promise<Event> {
		let event : Event = {
			id: this.id,
			name: input.name,
			description: input.description,
			creatorId: userId,
			coordinates: input.coordinates,
			confirmationDeadline: input.confirmationDeadline,
			createdAt: undefined,
			updatedAt: undefined,
			date: input.date,
		};
		const guest: Guest = {
			id: this.guestId++,
			userId: 1,
			eventId: this.id++,
			confirmationStatus: 'HOST',
		};
		this.events.push(event);
		this.guests.push(guest);
		return Promise.resolve(event);
	}

	getEventsByNameOrDescriptionAndUserId(userId: number, search: string): Promise<{
		id: number;
		name: string;
		description: string;
		coordinates: number[];
		confirmationDeadline: Date;
		date: Date
	}[]> {
		return Promise.resolve([]);
	}

	getEventsByUserId(userId: number): Promise<{
		id: number;
		name: string;
		description: string;
		coordinates: number[];
		confirmationDeadline: Date;
		date: Date
	}[]> {
		return Promise.resolve([]);
	}

	getHostGuest(userId: number, eventId: number): Promise<Guest> {
		return Promise.resolve(undefined);
	}

	updateEvent(eventId: number, input: NewEventInput): Promise<Event> {
		return Promise.resolve(undefined);
	}

	checkIfUserIsCreator(userId: number, eventId: number): Promise<{ creatorId: number }> {
		return Promise.resolve({creatorId: 0});
	}

	countGuestsByEventId(id: number): Promise<number> {
		return Promise.resolve(0);
	}

	deleteEventAndGuests(eventId: number): any {
	}

	findConfirmationStatus(userId: number, id: number): Promise<{ confirmationStatus: string }> {
		return Promise.resolve({confirmationStatus: ""});
	}

}