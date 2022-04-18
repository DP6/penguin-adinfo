'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.User = void 0;
const RoutesPermission_1 = require('./RoutesPermission');
const bcrypt = require('bcrypt');
class User {
	constructor(id, permission, advertiser, email, active = true, adOpsTeam = '', password) {
		this._salt = parseInt(process.env.SALT);
		this._permission = permission;
		this._adOpsTeam = adOpsTeam;
		this._advertiser = advertiser;
		this._email = email;
		this._id = id;
		this._password = password;
		this._active = active;
	}
	hasPermissionFor(route, method) {
		return new RoutesPermission_1.RoutesPermission(route, method).validatePermission(this);
	}
	toJson() {
		return {
			adOpsTeam: this._adOpsTeam,
			advertiser: this._advertiser,
			permission: this._permission,
			email: this._email,
			id: this._id,
			active: this._active,
		};
	}
	toJsonSave() {
		return {
			adOpsTeam: this._adOpsTeam,
			advertiser: this._advertiser,
			permission: this._permission,
			email: this._email,
			active: this._active,
			password: bcrypt.hashSync(this._password, this._salt),
		};
	}
	set password(newPassword) {
		this._password = newPassword;
	}
	get permission() {
		return this._permission;
	}
	get adOpsTeam() {
		return this._adOpsTeam;
	}
	get advertiser() {
		return this._advertiser;
	}
	get email() {
		return this._email;
	}
	get active() {
		return this._active;
	}
	get id() {
		return this._id;
	}
}
exports.User = User;
