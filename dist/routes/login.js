'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const ApiResponse_1 = require('../models/ApiResponse');
const UserDAO_1 = require('../models/DAO/UserDAO');
const JWT_1 = require('../models/JWT');
const login = (app) => {
	app.post('/login', (req, res) => {
		const apiResponse = new ApiResponse_1.ApiResponse();
		new UserDAO_1.UserDAO(req.body.email, req.body.password)
			.getUser()
			.then((user) => {
				if (user.activate) {
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
};
exports.default = login;
