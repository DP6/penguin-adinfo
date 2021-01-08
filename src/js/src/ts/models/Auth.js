'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Auth = void 0;
const RoutesPermission_1 = require('./RoutesPermission');
class Auth {
	constructor(permission, agency = '') {
		this._permission = permission;
		this._agency = agency;
	}
	hasPermissionFor(route, method) {
		return new RoutesPermission_1.RoutesPermission(
			route,
			method
		).validatePermission(this);
	}
	get permission() {
		return this._permission;
	}
}
exports.Auth = Auth;
