'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.JWT = void 0;
const jwt = require('jsonwebtoken');
const User_1 = require('./User');
class JWT {
	constructor(user) {
		this._pass = process.env.JWT_KEY;
		this._user = user || undefined;
	}
	createToken() {
		const payload = this._user.toJson();
		const token = jwt.sign(payload, this._pass);
		return token;
	}
	validateToken(token) {
		const payload = jwt.verify(token, this._pass);
		if (typeof payload === 'object') {
			return new User_1.User(payload.id, payload.permission, payload.company, payload.email, payload.agency);
		}
	}
}
exports.JWT = JWT;
