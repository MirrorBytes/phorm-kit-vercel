import { Resolver, Authorized, Ctx, Query, Mutation, Arg } from 'type-graphql';
import jwt from 'jsonwebtoken';

import { User, AuthContext } from '../entities/user';
import Register from '../entities/validators/register';
import Login from '../entities/validators/login';
import type { Context } from '../types';
import { Result } from './types';

@Resolver(() => User)
export class UserResolver {
	@Authorized()
	@Query(() => User)
	async user(@Ctx() { req, em }: Context): Promise<User> {
		const { cookies } = req;

		const [header, signature] = cookies['_head:sess'].split('.');
		// eslint-disable-next-line dot-notation
		const payload = cookies['_pay'];

		const token = jwt.verify(
			[header, payload, signature].join('.'),
			process.env.PUB_KEY
		) as AuthContext;

		return em.findOne(User, { id: token.id });
	}

	@Mutation(() => Result)
	async register(@Ctx() { res, em }: Context, @Arg('data') data: Register): Promise<Result> {
		const { email, name, password, confirmPassword } = data;
		const check = await em.findOne(User, { email });

		if (check) return new Result(false, 'Email in use!');

		try {
			await User.register(res, em, {
				email,
				name,
				password,
				confirmPassword
			});
		} catch (e: unknown) {
			const err = e as Error;

			return new Result(false, err.message);
		}

		return new Result(true, 'Successfully registered user!');
	}

	@Mutation(() => Result)
	async login(@Ctx() { res, em }: Context, @Arg('data') data: Login): Promise<Result> {
		const { email, password } = data;
		const user = await em.findOne(User, { email });

		if (!user) return new Result(false, 'User does not exist!');

		if (!(await user.checkPassword(password, em))) {
			return new Result(false, 'Invalid password!');
		}

		await user.login(res);

		return new Result(true, 'User successfully logged in!');
	}

	@Mutation(() => Result)
	logout(@Ctx() { res }: Context): Result {
		User.logout(res);

		return new Result(true, 'Successfuly logged user out!');
	}
}
