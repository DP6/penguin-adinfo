import { Auth } from './Auth';

export class RoutesPermission {
	private _method: string;
	private _route: string;

	constructor(route: string, method: string) {
		this._method = method;
		this._route = route;
	}

	public validatePermission(auth: Auth): boolean {
		const agencyPostRoutes = ['/build/.*', '/csv'];
		const agencyGetRoutes = [
			'/config',
			'/template',
			'/csv/list',
			'/csv',
			'/user',
		];
		if (auth.permission === 'user') {
			if (this._method === 'POST') {
				return (
					agencyPostRoutes.filter((route) =>
						new RegExp(route).test(this._route)
					).length > 0
				);
			} else if (this._method === 'GET') {
				return (
					agencyGetRoutes.filter((route) =>
						new RegExp(route).test(this._route)
					).length > 0
				);
			} else {
				return false;
			}
		} else if (auth.permission === 'admin' || auth.permission === 'owner') {
			return true;
		} else {
			return false;
		}
	}
}
