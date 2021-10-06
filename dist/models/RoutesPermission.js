'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.RoutesPermission = void 0;
class RoutesPermission {
	constructor(route, method) {
		this._method = method;
		this._route = route;
	}
	validatePermission(user) {
		const agencyPostRoutes = ['/build/.*', '/csv', '/user/changepass', '/logout', '/login', '/campaign/add'];
		const agencyGetRoutes = ['/config', '/template', '/csv/list', '/csv', '/user', '/campaign/list', '/campaign/teste'];
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
exports.RoutesPermission = RoutesPermission;
