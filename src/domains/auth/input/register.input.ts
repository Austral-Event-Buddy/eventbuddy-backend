import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class RegisterInput {
	@IsEmail()
	email: string
	@IsString()
	@IsNotEmpty()
	password: string
	@IsString()
	@IsNotEmpty()
	username: string
	@IsString()
	name: string
}