import { header, validationResult } from 'express-validator';
import { Auth } from '../models/Auth';
import { AuthDAO } from '../models/DAO/AuthDAO';
import { ApiResponse } from '../models/ApiResponse';

const register = (app: { [key: string]: any }): void => {
	app.post(
		'/register',
		header('permission').exists().withMessage('Parâmetro permission é obrigatório.'),
		header('email').exists().withMessage('Parâmetro email é obrigatório.').isEmail().withMessage('Email inválido.'),
		(req: { [key: string]: any }, res: { [key: string]: any }) => {
			const validationErrors = validationResult(req).array();

			const apiResponse = new ApiResponse();

			if (!req.headers.agency) {
				validationErrors.push({
					param: 'email',
					value: req.header.agency,
					location: 'headers',
					msg: 'Parâmetro agency é obrigatório.',
				});
			}
			if (validationErrors.length > 0) {
				const message = validationErrors.map((err) => err.msg).join(' ');
				apiResponse.responseText = message;
				apiResponse.statusCode = 400;
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				return;
			}

			const newUserAuth = new Auth(
				req.headers.permission,
				req.company,
				req.headers.permission === 'user' ? req.headers.agency : '',
				req.headers.email
			);

			const token = req.headers.token;
			const authDAO = new AuthDAO(token);
			authDAO
				.addAuth(newUserAuth)
				.then((token) => {
					const message = `Permissão adicionada para o email ${newUserAuth.email}, senha: ${token}`;
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
		}
	);
};

export default register;
