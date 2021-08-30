import { User } from './User';

export class RoutesPermission {
	private _method: string;
	private _route: string;

	constructor(route: string, method: string) {
		this._method = method;
		this._route = route;
	}

	public validatePermission(user: User): boolean {
		const agencyPostRoutes = ['/build/.*', '/csv', '/user/changepass', '/logout', '/login'];
		const agencyGetRoutes = ['/config', '/template', '/csv/list', '/csv', '/user'];
		if (user.permission === 'user') {
			if (this._method === 'POST') {
				return agencyPostRoutes.filter((route) => new RegExp(route).test(this._route)).length > 0;
			} else if (this._method === 'GET') {
				return agencyGetRoutes.filter((route) => new RegExp(route).test(this._route)).length > 0;
			} else {
				return false;
			}
		} else if (user.permission === 'admin' || user.permission === 'owner') {
			return true;
		} else {
			return false;
		}
	}
}
