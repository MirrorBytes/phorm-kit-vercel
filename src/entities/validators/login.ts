import { Field, InputType } from 'type-graphql';
import { IsEmail } from 'class-validator';

@InputType()
export default class Login {
	@Field(() => String)
	@IsEmail()
	public email: string;

	@Field(() => String)
	public password: string;
}
