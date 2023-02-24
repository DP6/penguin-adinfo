'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.RoutesPermission = void 0;
class RoutesPermission {
	constructor(route, method) {
		this._method = method;
		this._route = route;
	}
	validatePermission(user) {
		const adOpsTeamUserPostRoutes = ['/build/.*', '/csv', '/user/changepass', '/logout', '/login'];
		const adOpsTeamUserGetRoutes = [
			'/config',
			'/template',
			'/csv/list',
			'/csv',
			'/user',
			'/campaign/.*/list',
			'/adOpsTeam/list',
			'/campaign/.*/csv/list',
			'/adOpsTeams/campaigns',
		];
		const adOpsManagerGetRoutes = adOpsTeamUserGetRoutes.slice();
		const adOpsManagerPostRoutes = adOpsTeamUserPostRoutes.slice();
		adOpsManagerGetRoutes.push('/template/excel', '/users', '/adOpsTeam/users');
		adOpsManagerPostRoutes.push(
			'/register',
			'/user/.*/deactivate',
			'/user/.*/reactivate',
			'/user/.*/delete',
			'/campaign/.*/deactivate',
			'/campaign/.*/reactivate',
			'/campaign/.*/delete',
			'/campaign'
		);
		if (user.permission === 'user') {
			if (this._method === 'POST') {
				return adOpsTeamUserPostRoutes.filter((route) => new RegExp(route).test(this._route)).length > 0;
			} else if (this._method === 'GET') {
				return adOpsTeamUserGetRoutes.filter((route) => new RegExp(route).test(this._route)).length > 0;
			} else {
				return false;
			}
		} else if (user.permission === 'adOpsManager') {
			if (this._method === 'POST') {
				return adOpsManagerPostRoutes.filter((route) => new RegExp(route).test(this._route)).length > 0;
			} else if (this._method === 'GET') {
				return adOpsManagerGetRoutes.filter((route) => new RegExp(route).test(this._route)).length > 0;
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
