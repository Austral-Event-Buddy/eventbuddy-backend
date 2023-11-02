import {ElementDto} from "../dto/element.dto";
import {
	ElementInput,
	NewElementInput,
	UpdateElementInput,
	UserElementInput
} from "../input";

export abstract class IElementService{
	abstract createElement(input: NewElementInput): Promise<ElementDto>;

	abstract addUser(userId: number, input: UserElementInput): Promise<ElementDto>;

	abstract deleteUser(userId: number, input: UserElementInput): Promise<ElementDto>;

	abstract updateElement(input: UpdateElementInput) : Promise<ElementDto>;

	abstract deleteElement(input: ElementInput);

	abstract getElementById(input: ElementInput): Promise<ElementDto>;
}