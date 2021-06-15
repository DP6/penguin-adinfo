'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const AuthDAO_1 = require('../models/DAO/AuthDAO');
const ApiResponse_1 = require('../models/ApiResponse');
const user = (app) => {
	app.get('/user', (req, res) => {
		const apiResponse = new ApiResponse_1.ApiResponse();
		new AuthDAO_1.AuthDAO(req.headers.token)
			.getAuth()
			.then((auth) => {
				apiResponse.responseText = JSON.stringify(auth.toJson());
				apiResponse.statusCode = 200;
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = 'Falha ao recuperar o usuário!';
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
};
exports.default = user;
