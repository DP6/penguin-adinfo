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
const express_validator_1 = require('express-validator');
const User_1 = require('../models/User');
const UserDAO_1 = require('../models/DAO/UserDAO');
const ApiResponse_1 = require('../models/ApiResponse');
const AdOpsTeamDAO_1 = require('../models/DAO/AdOpsTeamDAO');
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
		(req, res) =>
			__awaiter(void 0, void 0, void 0, function* () {
				const apiResponse = new ApiResponse_1.ApiResponse();
				let adOpsTeam = req.body.adOpsTeam;
				const adOpsTeamDAO = new AdOpsTeamDAO_1.AdOpsTeamDAO();
				if (req.permission === 'AdOpsTeamManager') {
					adOpsTeam = req.adOpsTeam;
				}
				const newUser = new User_1.User(
					'',
					req.body.permission,
					req.advertiser,
					req.body.email,
					true,
					adOpsTeam,
					req.body.password
				);
				if (
					(req.permission === 'owner' || req.permission === 'admin') &&
					(req.body.permission === 'user' || req.body.permission === 'adopsteammanager') &&
					!adOpsTeam
				) {
					const message = 'AdOpsTeam não informado.';
					apiResponse.responseText = message;
					apiResponse.errorMessage = message;
					apiResponse.statusCode = 400;
					res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
					return;
				}
				if (adOpsTeam) {
					yield adOpsTeamDAO.getAdOpsTeam(adOpsTeam).catch((err) => {
						apiResponse.responseText = err.message;
						apiResponse.errorMessage = err.message;
						apiResponse.statusCode = 400;
						res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
					});
					return;
				}
				new UserDAO_1.UserDAO()
					.addUser(newUser)
					.then(() => {
						const message = `Usuário criado para o email ${newUser.email}`;
						apiResponse.responseText = message;
						apiResponse.statusCode = 200;
					})
					.catch((err) => {
						const message = 'Falha ao criar permissão!';
						apiResponse.responseText = message;
						apiResponse.errorMessage = err.message;
						apiResponse.statusCode = 500;
					})
					.finally(() => {
						res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
					});
			})
	);
};
exports.default = register;
