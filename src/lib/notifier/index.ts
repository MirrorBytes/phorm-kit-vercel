import { notification } from '../../stores';

export function send(message: string, theme = 'default', timeout?: number): void {
	notification.set({ theme, message, timeout });
}

export function danger(msg: string, timeout?: number): void {
	send(msg, 'danger', timeout);
}

export function warning(msg: string, timeout?: number): void {
	send(msg, 'warning', timeout);
}

export function info(msg: string, timeout?: number): void {
	send(msg, 'info', timeout);
}

export function success(msg: string, timeout?: number): void {
	send(msg, 'success', timeout);
}
