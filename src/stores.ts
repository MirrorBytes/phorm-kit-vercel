import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

import type { Notification } from './types';

export const notification: Writable<Notification | undefined> = writable(undefined);

export const authTrigger = writable(false);
