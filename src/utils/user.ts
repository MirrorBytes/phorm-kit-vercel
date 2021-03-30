import Cookies from 'js-cookie';

export const USER_COOKIE = '_pay';

export function checkForUser(): boolean {
	return Cookies.get(USER_COOKIE) !== undefined && Cookies.get(USER_COOKIE) !== '0';
}
