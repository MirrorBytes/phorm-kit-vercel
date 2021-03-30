import { Field, InputType } from 'type-graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export default class Register {
	@Field(() => String)
	@IsString()
	public name: string;

	@Field(() => String)
	@IsEmail()
	public email: string;

	@Field(() => String)
	public password: string;

	@Field(() => String)
	public confirmPassword: string;
}
