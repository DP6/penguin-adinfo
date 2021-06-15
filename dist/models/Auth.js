'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Auth = void 0;
const RoutesPermission_1 = require('./RoutesPermission');
class Auth {
	constructor(permission, company, agency = '', email) {
		this._permission = permission;
		this._agency = agency;
		this._company = company;
		this._email = email;
	}
	hasPermissionFor(route, method) {
		return new RoutesPermission_1.RoutesPermission(route, method).validatePermission(this);
	}
	toJson() {
		return {
			agency: this._agency,
			company: this._company,
			permission: this._permission,
			email: this._email,
		};
	}
	get permission() {
		return this._permission;
	}
	get agency() {
		return this._agency;
	}
	get company() {
		return this._company;
	}
	get email() {
		return this._email;
	}
}
exports.Auth = Auth;
