import {EventDto} from "./event.dto";

export class EventHostStatusDto extends EventDto{
    isHost: boolean
    constructor(newEvent : EventHostStatusDto) {
        super(newEvent);
        this.isHost = newEvent.isHost
    }
}