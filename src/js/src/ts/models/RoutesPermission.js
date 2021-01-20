'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.RoutesPermission = void 0;
class RoutesPermission {
	constructor(route, method) {
		this._method = method;
		this._route = route;
	}
	validatePermission(auth) {
		const agencyPostRoutes = ['/build/.*', '/csv'];
		const agencyGetRoutes = [
			'/config',
			'/template',
			'/csv/list',
			'/csv',
			'/user',
		];
		if (auth.permission === 'agency') {
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
		} else if (auth.permission === 'global') {
			return true;
		} else {
			return false;
		}
	}
}
exports.RoutesPermission = RoutesPermission;
