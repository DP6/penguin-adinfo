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
		const adOpsManagerDeleteRoutes = ['/campaign/.*/delete', '/user/.*/delete'];
		adOpsManagerGetRoutes.push('/template/excel', '/users', '/adOpsTeam/users');
		adOpsManagerPostRoutes.push(
			'/register',
			'/user/.*/deactivate',
			'/user/.*/reactivate',
			'/campaign/.*/deactivate',
			'/campaign/.*/reactivate',
			'/campaign'
		);
		const permissionRoutes = {
			user: {
				GET: adOpsTeamUserGetRoutes,
				POST: adOpsTeamUserPostRoutes,
			},
			adOpsManager: {
				GET: adOpsManagerGetRoutes,
				POST: adOpsManagerPostRoutes,
				DELETE: adOpsManagerDeleteRoutes,
			},
			admin: {},
			owner: {},
		};
		if (user.permission === 'admin' || user.permission === 'owner') {
			return true;
		}
		const routes = permissionRoutes[user.permission];
		if (!routes) {
			return false;
		}
		const allowedRoutes = routes[this._method] || [];
		return allowedRoutes.some((route) => new RegExp(route).test(this._route));
	}
}
exports.RoutesPermission = RoutesPermission;
