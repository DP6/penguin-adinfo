'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express_validator_1 = require('express-validator');
const User_1 = require('../models/User');
const UserDAO_1 = require('../models/DAO/UserDAO');
const ApiResponse_1 = require('../models/ApiResponse');
const AdOpsTeamDAO_1 = require('../models/DAO/AdOpsTeamDAO');
const AdOpsTeamMissingError_1 = require('../Errors/AdOpsTeamMissingError');
const register = (app) => {
	app.post(
		'/register',
		(0, express_validator_1.body)('permission').exists().withMessage('Parâmetro permission é obrigatório.'),
		(0, express_validator_1.body)('email')
			.exists()
			.withMessage('Parâmetro email é obrigatório.')
			.isEmail()
			.withMessage('Email inválido.'),
		(0, express_validator_1.body)('password').exists().withMessage('Parâmetro password é obrigatório.'),
		(req, res) => {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const adOpsTeam = req.body.adOpsTeam;
			const adOpsTeamDAO = new AdOpsTeamDAO_1.AdOpsTeamDAO();
			const newUser = new User_1.User(
				'',
				req.body.permission,
				req.advertiser,
				req.body.email,
				true,
				adOpsTeam,
				req.body.password
			);
			adOpsTeamDAO
				.getAdOpsTeam(adOpsTeam)
				.then(() => {
					const userDAO = new UserDAO_1.UserDAO();
					userDAO.addUser(newUser);
				})
				.then(() => {
					const message = `Usuário criado para o email ${newUser.email}`;
					apiResponse.responseText = message;
					apiResponse.statusCode = 200;
				})
				.catch((err) => {
					if (err.name === AdOpsTeamMissingError_1.AdOpsTeamMissingError) {
						const message = err.message;
						apiResponse.responseText = message;
						apiResponse.errorMessage = err.message;
						apiResponse.statusCode = 400;
					}
					const message = 'Falha ao criar permissão!';
					apiResponse.responseText = message;
					apiResponse.errorMessage = err.message;
					apiResponse.statusCode = 500;
				})
				.finally(() => {
					res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				});
		}
	);
};
exports.default = register;
