'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const ApiResponse_1 = require('../models/ApiResponse');
const UserDAO_1 = require('../models/DAO/UserDAO');
const user = (app) => {
	app.get('/users', (req, res) => {
		const apiResponse = new ApiResponse_1.ApiResponse();
		new UserDAO_1.UserDAO()
			.getAllUsersFrom(req.advertiser, req.permission)
			.then((users) => {
				apiResponse.responseText = JSON.stringify(users.map((user) => user.toJson()));
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = err.message;
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
	app.get('/user', (req, res) => {
		const apiResponse = new ApiResponse_1.ApiResponse();
		const user = {
			permission: req.permission,
			adOpsTeam: req.adOpsTeam,
			advertiser: req.advertiser,
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
	app.post('/user/:id/deactivate', (req, res) => {
		const apiResponse = new ApiResponse_1.ApiResponse();
		const targetUserId = req.params.id;
		new UserDAO_1.UserDAO()
			.deactivateUser(targetUserId, req.permission)
			.then((result) => {
				if (result) {
					apiResponse.statusCode = 200;
					apiResponse.responseText = 'Usuário desativado com sucesso!';
				} else {
					throw new Error('Erro ao desativar usuário!');
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
	app.post('/user/:id/reactivate', (req, res) => {
		const apiResponse = new ApiResponse_1.ApiResponse();
		const targetUserId = req.params.id;
		new UserDAO_1.UserDAO()
			.reactivateUser(targetUserId, req.permission)
			.then((result) => {
				if (result) {
					apiResponse.statusCode = 200;
					apiResponse.responseText = 'Usuário re-ativado com sucesso!';
				} else {
					throw new Error('Erro ao re-ativar usuário!');
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
