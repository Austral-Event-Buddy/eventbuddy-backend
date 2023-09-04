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

	getEventsByUserId(userId: number): Promise<Event[]> {
		const eventsIds :number[] = [];
		for(let i=0; i<this.guests.length; i++){
			if (this.guests[i].userId === userId) eventsIds.push(this.guests[i].eventId);
		}
		const result = [];
		for(let i=0; i<eventsIds.length; i++){
			for (let j = 0; j < this.events.length; j++) {
				if (this.events[j].id === eventsIds[i]) result.push(this.events[j]);
			}
		}
		return Promise.resolve(result);
	}

	findConfirmationStatus(userId: number, id: number): Promise<{confirmationStatus: string}> {
		for(let i=0; i<this.guests.length; i++){
			if (this.guests[i].userId === userId && this.guests[i].eventId === id){
				return Promise.resolve({confirmationStatus: this.guests[i].confirmationStatus})
			}
		}
		return undefined;
	}

	countGuestsByEventId(id: number): Promise<number> {
		let counter = 0;
		for(let i=0; i<this.guests.length; i++){
			if (this.guests[i].eventId === id &&
				(this.guests[i].confirmationStatus === 'ATTENDING' ||
					this.guests[i].confirmationStatus === 'HOST')) counter++;
		}
		return Promise.resolve(counter);
	}

	async getEventsByNameOrDescriptionAndUserId(userId: number, search: string): Promise<Event[]> {
		const userEvents : Event[] = await this.getEventsByUserId(userId);
		const result = [];
		for (let i = 0; i < userEvents.length; i++) {
			if(userEvents[i].name.includes(search) || userEvents[i].description.includes(search)) result.push(userEvents[i]);
		}
		return Promise.resolve(result);
	}

	updateEvent(eventId: number, input: NewEventInput): Promise<Event> {
		return Promise.resolve(undefined);
	}

	checkIfUserIsCreator(userId: number, eventId: number): Promise<{
		creatorId: number
	}> {
		return Promise.resolve({creatorId: 0});
	}



	deleteEventAndGuests(eventId: number): any {
	}

	getHostGuest(userId: number, eventId: number): Promise<Guest> {
		return Promise.resolve(undefined);
	}

}