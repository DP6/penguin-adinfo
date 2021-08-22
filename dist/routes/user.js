'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const ApiResponse_1 = require('../models/ApiResponse');
const UserDAO_1 = require('../models/DAO/UserDAO');
const user = (app) => {
	app.get('/user', (req, res) => {
		const apiResponse = new ApiResponse_1.ApiResponse();
		const user = {
			permission: req.permission,
			agency: req.agency,
			company: req.company,
			email: req.email,
		};
		apiResponse.statusCode = 200;
		apiResponse.responseText = JSON.stringify(user);
		res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
	});
	app.post('/user/changepass', (req, res) => {
		const apiResponse = new ApiResponse_1.ApiResponse();
		new UserDAO_1.UserDAO(req.email, req.body.password)
			.getUser()
			.then((user) => {
				user.password = req.body.newPassword;
				return new UserDAO_1.UserDAO().changePassword(user);
			})
			.then((result) => {
				if (result) {
					apiResponse.statusCode = 200;
					apiResponse.responseText = 'Senha alterada com sucesso!';
				} else {
					throw new Error('Erro ao modificar a senha!');
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
exports.default = user;
