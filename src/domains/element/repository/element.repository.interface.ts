import {NewElementInput} from "../input/newElementInput";

export abstract class IElementRepository{
	abstract createElement(input: NewElementInput): Promise<ElementDto>;
}