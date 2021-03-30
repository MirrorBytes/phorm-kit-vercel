import 'reflect-metadata';

import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class Result {
	@Field(() => Boolean)
	ok!: boolean;

	@Field(() => String)
	msg!: string;

	constructor(ok: boolean, msg: string) {
		this.ok = ok;
		this.msg = msg;
	}
}
