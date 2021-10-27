import { User } from './User';

export class RoutesPermission {
	private _method: string;
	private _route: string;

	constructor(route: string, method: string) {
		this._method = method;
		this._route = route;
	}

	public validatePermission(user: User): boolean {
		const agencyUserPostRoutes = ['/build/.*', '/csv', '/user/changepass', '/logout', '/login'];
		const agencyUserGetRoutes = [
			'/config',
			'/template',
			'/csv/list',
			'/csv',
			'/user',
			'/campaign/.*/list',
			'/agency/list',
			'/campaign/.*/csv/list',
			'/agencies/campaigns',
		];
		const agencyOwnerGetRoutes = agencyUserGetRoutes.slice();
		const agencyOwnerPostRoutes = agencyUserPostRoutes.slice();

		agencyOwnerGetRoutes.push('/template/excel', '/users', '/agency/users');
		agencyOwnerPostRoutes.push(
			'/register',
			'/user/.*/deactivate',
			'/user/.*/reactivate',
			'/campaign/.*/deactivate',
			'/campaign/.*/reactivate',
			'/campaign'
		);

		if (user.permission === 'user') {
			if (this._method === 'POST') {
				return agencyUserPostRoutes.filter((route) => new RegExp(route).test(this._route)).length > 0;
			} else if (this._method === 'GET') {
				return agencyUserGetRoutes.filter((route) => new RegExp(route).test(this._route)).length > 0;
			} else {
				return false;
			}
		} else if (user.permission === 'agencyOwner') {
			if (this._method === 'POST') {
				return agencyOwnerPostRoutes.filter((route) => new RegExp(route).test(this._route)).length > 0;
			} else if (this._method === 'GET') {
				return agencyOwnerGetRoutes.filter((route) => new RegExp(route).test(this._route)).length > 0;
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
