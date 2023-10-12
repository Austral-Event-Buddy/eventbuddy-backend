import {Injectable} from "@nestjs/common";
import {IElementService} from "./element.service.interface";

@Injectable()
export class ElementService implements IElementService {}