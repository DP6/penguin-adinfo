'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.BlackListSingleton = void 0;
const JWT_1 = require('./JWT');
class BlackListSingleton {
	constructor() {
		this._blacklist = {};
		this._jwt = new JWT_1.JWT();
	}
	static getInstance() {
		if (!BlackListSingleton._instance) {
			BlackListSingleton._instance = new BlackListSingleton();
		}
		return BlackListSingleton._instance;
	}
	addToken(token) {
		BlackListSingleton.getInstance().addItem(token);
		return;
	}
	addItem(item) {
		BlackListSingleton.getInstance().clearBlacklist();
		BlackListSingleton.getInstance().blacklist[item] = Date.now();
	}
	clearBlacklist() {
		Object.keys(BlackListSingleton.getInstance().blacklist).filter((key) => {
			try {
				BlackListSingleton.getInstance().jwt.validateToken(key);
				return true;
			} catch (err) {
				return false;
			}
		});
	}
	findToken(token) {
		BlackListSingleton.getInstance().clearBlacklist();
		return !!BlackListSingleton.getInstance().blacklist[token];
	}
	get blacklist() {
		return this._blacklist;
	}
	get jwt() {
		return this._jwt;
	}
}
exports.BlackListSingleton = BlackListSingleton;
