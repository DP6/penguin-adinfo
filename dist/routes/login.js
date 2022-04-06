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
const ApiResponse_1 = require('../models/ApiResponse');
const BlockList_1 = require('../models/BlockList');
const UserDAO_1 = require('../models/DAO/UserDAO');
const JWT_1 = require('../models/JWT');
const login = (app) => {
	app.post('/login', (req, res) => {
		const apiResponse = new ApiResponse_1.ApiResponse();
		new UserDAO_1.UserDAO(req.body.email, req.body.password)
			.getUser()
			.then((user) => {
				if (user.active) {
					const token = new JWT_1.JWT(user).createToken();
					res.set('Authorization', token);
					apiResponse.statusCode = 204;
				} else {
					apiResponse.statusCode = 403;
					apiResponse.responseText = 'Usuário desativado!';
					apiResponse.errorMessage = 'Usuário desativado!';
				}
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = 'Email e/ou senha incorreto(s)!';
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
	app.post('/logout', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			try {
				yield new BlockList_1.BlockList().addToken(req.token);
				apiResponse.statusCode = 200;
				apiResponse.responseText = 'Logout efetuado com sucesso!';
			} catch (err) {
				apiResponse.statusCode = 500;
				apiResponse.responseText = 'Falha ao efetuar o logout!';
				apiResponse.errorMessage = err.message;
			}
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
		})
	);
};
exports.default = login;
