if (process.env.NODE_ENV !== 'production') {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require('dotenv').config();
}

import 'reflect-metadata';

import path from 'path';
import jwt from 'jsonwebtoken';
import { AuthChecker, buildSchema } from 'type-graphql';
import type { GraphQLSchema } from 'graphql';

import type { Context } from '../types';
import type { AuthContext } from '../entities/user';

import { UserResolver } from '../resolvers/user';

export const createSchema = async (): Promise<GraphQLSchema> => {
	const customAuthChecker: AuthChecker<Context> = ({ context: { req } }, roles) => {
		const { cookies } = req;

		const [header, signature] = cookies['_head:sess'].split('.');
		// eslint-disable-next-line dot-notation
		const payload = cookies['_pay'];

		const token = jwt.verify(
			[header, payload, signature].join('.'),
			process.env.PUB_KEY.replace(/\\n/gm, '\n'),
			{
				algorithms: ['RS256']
			}
		) as AuthContext;

		if (!token.id) {
			return false;
		}

		if (!roles || roles.length === 0) {
			return true;
		}

		if (!roles.includes(token.type)) {
			return false;
		}

		return true;
	};

	return buildSchema({
		resolvers: [UserResolver],
		emitSchemaFile: path.resolve(__dirname, '../generated', 'schema.gql'),
		authChecker: customAuthChecker
	});
};

export const defaultQuery = `# Try out our API with a query like this:

query {
	double(number: 12)
}
`;
