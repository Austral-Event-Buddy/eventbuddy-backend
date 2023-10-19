import {NewElementInput} from "../input/newElementInput";

export abstract class IElementService{
	abstract createElement(input: NewElementInput): Promise<ElementDto>;
}