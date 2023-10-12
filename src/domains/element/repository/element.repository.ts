import {Injectable} from "@nestjs/common";
import {IElementRepository} from "./element.repository.interface";

@Injectable()
export class ElementRepository implements IElementRepository {}