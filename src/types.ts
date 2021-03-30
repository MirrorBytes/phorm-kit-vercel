import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { EntityManager } from '@mikro-orm/core';

export type Context = {
	req: VercelRequest;

	res: VercelResponse;

	em: EntityManager;
};

export type Notification = {
	theme: string;

	message: string;

	timeout?: number;
};
