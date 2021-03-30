import { Entity, Property, Unique } from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';
import SecurePassword from 'secure-password';
import jwt from 'jsonwebtoken';
import type { VercelResponse } from '@vercel/node';
import type { EntityManager } from '@mikro-orm/core';

import { Base } from './base';
// import type { Form } from './form';

const secured = new SecurePassword({
	memlimit: SecurePassword.MEMLIMIT_DEFAULT,
	opslimit: SecurePassword.OPSLIMIT_DEFAULT
});

export enum AuthType {
	FULL = 'FULL'
}

export type AuthContext = {
	id: string;
	type: AuthType;
};

function setCookies(name: string, value: string, options: Record<string, unknown>): string {
	const keys = Object.keys(options);
	const conOptions = keys.map((key) => `${key}=${options[key]}`);

	return `${name}=${value}; ${conOptions.join(';')}`;
}

@Entity()
@ObjectType()
export class User extends Base<User> {
	@Field(() => String)
	@Property({ columnType: 'citext' })
	@Unique()
	email!: string;

	@Field(() => String)
	@Property()
	name!: string;

	@Property({ columnType: 'bytea' })
	password!: Buffer;

	// @OneToMany('Form', 'user')
	// forms!: Form[];

	async setPassword(password: string): Promise<void> {
		this.password = await secured.hash(Buffer.from(password));
	}

	async checkPassword(password: string, em: EntityManager): Promise<boolean> {
		const result = await secured.verify(Buffer.from(password), this.password);

		if (result === SecurePassword.VALID_NEEDS_REHASH) {
			await this.setPassword(password);
			await em.persistAndFlush(this);
		}

		return result === SecurePassword.VALID || result === SecurePassword.VALID_NEEDS_REHASH;
	}

	static async register(
		res: VercelResponse,
		em: EntityManager,
		{
			email,
			name,
			password,
			confirmPassword
		}: {
			email: string;
			name: string;
			password: string;
			confirmPassword: string;
		}
	): Promise<User> {
		if (password.length <= 3) {
			throw new Error('Please provide password longer than 3 characters!');
		}

		if (password !== confirmPassword) throw new Error('Passwords must match!');

		const user = new User();

		user.email = email;
		user.name = name;

		await user.setPassword(password);
		await em.persistAndFlush(user);
		await user.login(res);

		return user;
	}

	async login(res: VercelResponse, type: AuthType = AuthType.FULL): Promise<void> {
		const [header, payload, signature] = jwt
			.sign(
				{
					id: this.id,
					type
				},
				process.env.PRIV_KEY.replace(/\\n/gm, '\n'),
				{
					algorithm: 'RS256'
				}
			)
			.split('.');

		res.setHeader('Set-Cookie', [
			setCookies('_head:sess', [header, signature].join('.'), {
				sameSite: 'strict',
				httpOnly: true,
				// secure: true,
				expires: new Date(new Date().getTime() + 86409000).toUTCString(),
				path: '/'
			}),
			setCookies('_pay', payload, {
				sameSite: 'strict',
				// secure: true,
				expires: new Date(new Date().getTime() + 86409000).toUTCString(),
				path: '/'
			})
		]);
	}

	static logout(res: VercelResponse): void {
		res.setHeader('Set-Cookie', [
			setCookies('_head:sess', '0', {
				path: '/',
				expires: 0
			}),
			setCookies('_pay', '0', {
				path: '/',
				expires: 0
			})
		]);
	}
}
