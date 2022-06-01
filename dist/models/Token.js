'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Token = void 0;
const RoutesPermission_1 = require('./RoutesPermission');
const User_1 = require('./User');
class Token extends User_1.User {
	constructor(id, permission, advertiser, email, active = true, adOpsTeam = '') {
		super(id, permission, advertiser, email, active, adOpsTeam, null);
	}
	hasPermissionFor(route, method) {
		return new RoutesPermission_1.RoutesPermission(route, method).validatePermission(this);
	}
	toJson() {
		return {
			adOpsTeam: this.adOpsTeam,
			advertiser: this.advertiser,
			permission: this.permission,
			email: this.email,
			id: this.id,
			active: this.active,
		};
	}
	toJsonSave() {
		return {
			adOpsTeam: this.adOpsTeam,
			advertiser: this.advertiser,
			permission: this.permission,
			email: this.email,
			active: this.active,
		};
	}
	get permission() {
		return super.permission;
	}
	get adOpsTeam() {
		return super.adOpsTeam;
	}
	get advertiser() {
		return super.advertiser;
	}
	get active() {
		return super.active;
	}
	get id() {
		return super.id;
	}
	get email() {
		return super.email;
	}
}
exports.Token = Token;
