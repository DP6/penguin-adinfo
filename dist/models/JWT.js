'use strict';
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
Object.defineProperty(exports, '__esModule', { value: true });
exports.JWT = void 0;
const jwt = require('jsonwebtoken');
const jsonwebtoken_1 = require('jsonwebtoken');
const BlockList_1 = require('./BlockList');
class JWT {
	constructor(user) {
		this._pass = process.env.JWT_KEY;
		this._expiresToken = process.env.EXPIRES_TOKEN;
		this._user = user || undefined;
	}
	createToken() {
		const payload = this._user.toJson();
		const token = jwt.sign(payload, this._pass, { expiresIn: this._expiresToken });
		return token;
	}
	verifyWithoutBlocklist(token) {
		try {
			jwt.verify(token, this._pass);
			return true;
		} catch (err) {
			return false;
		}
	}
	validateToken(token) {
		return __awaiter(this, void 0, void 0, function* () {
			const userInBlocklist = yield new BlockList_1.BlockList().findToken(token);
			if (userInBlocklist) {
				throw new Error('Token inválido!');
			}
			try {
				const payload = jwt.verify(token, this._pass);
				if (typeof payload === 'object') {
					return payload;
				}
			} catch (er) {
				if (er instanceof jsonwebtoken_1.TokenExpiredError) {
					throw new Error('Token expirado! Faça o login novamente.');
				}
				throw new Error(er);
			}
		});
	}
}
exports.JWT = JWT;
