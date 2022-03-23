'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ProgrammaticUser = void 0;
const RoutesPermission_1 = require('./RoutesPermission');
const User_1 = require('./User');
class ProgrammaticUser extends User_1.User {
	constructor(id, permission, company, email, activate = true, agency = '') {
		super(id, permission, company, email, activate, agency, null);
	}
	hasPermissionFor(route, method) {
		return new RoutesPermission_1.RoutesPermission(route, method).validatePermission(this);
	}
	toJson() {
		return {
			agency: this.agency,
			company: this.company,
			permission: this.permission,
			email: this.email,
			id: this.id,
			activate: this.activate,
		};
	}
	toJsonSave() {
		return {
			agency: this.agency,
			company: this.company,
			permission: this.permission,
			email: this.email,
			activate: this.activate,
		};
	}
	get permission() {
		return super.permission;
	}
	get agency() {
		return super.agency;
	}
	get company() {
		return super.company;
	}
	get activate() {
		return super.activate;
	}
	get id() {
		return super.id;
	}
	get email() {
		return super.email;
	}
}
exports.ProgrammaticUser = ProgrammaticUser;
