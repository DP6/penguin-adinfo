'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express_validator_1 = require('express-validator');
const Auth_1 = require('../models/Auth');
const AuthDAO_1 = require('../models/DAO/AuthDAO');
const register = (app) => {
	app.post(
		'/register',
		express_validator_1.header('permission').exists().withMessage('Parâmetro permission é obrigatório.'),
		express_validator_1.header('company').exists().withMessage('Parâmetro company é obrigatório.'),
		express_validator_1
			.header('email')
			.exists()
			.withMessage('Parâmetro email é obrigatório.')
			.isEmail()
			.withMessage('Email inválido.'),
		(req, res) => {
			const validationErrors = express_validator_1.validationResult(req).array();
			if (!req.headers.agency) {
				validationErrors.push({
					param: 'email',
					value: req.header.agency,
					location: 'headers',
					msg: 'Parâmetro agency é obrigatório.',
				});
			}
			if (validationErrors.length > 0) {
				const msg = validationErrors.map((err) => err.msg).join(' ');
				res.status(400).json({ message: msg });
				return;
			}
			const newUserAuth = new Auth_1.Auth(
				req.headers.permission,
				req.headers.company,
				req.headers.permission === 'user' ? req.headers.agency : '',
				req.headers.email
			);
			const token = req.headers.token;
			const authDAO = new AuthDAO_1.AuthDAO(token);
			authDAO
				.addAuth(newUserAuth)
				.then((token) => {
					res.status(200).send(`Permissão adicionada para o email ${newUserAuth.email}, senha: ${token}`);
				})
				.catch((err) => {
					res.status(500).send('Falha ao criar permissão!');
				});
		}
	);
};
exports.default = register;
