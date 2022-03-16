import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import { UserDAO } from '../models/DAO/UserDAO';
import { ApiResponse } from '../models/ApiResponse';

const register = (app: { [key: string]: any }): void => {
	app.post(
		'/register',
		body('permission').exists().withMessage('Parâmetro permission é obrigatório.'),
		body('email').exists().withMessage('Parâmetro email é obrigatório.').isEmail().withMessage('Email inválido.'),
		body('password').exists().withMessage('Parâmetro password é obrigatório.'),
		(req: { [key: string]: any }, res: { [key: string]: any }) => {
			const validationErrors = validationResult(req).array();

			const apiResponse = new ApiResponse();

			let adOpsTeam = '';

			if (req.adOpsTeam && req.body.permission === 'user') {
				adOpsTeam = req.adOpsTeam;
			} else if (req.body.adOpsTeam && req.body.permission === 'adOpsManager') {
				adOpsTeam = req.body.adOpsTeam;
			} else if (
				!req.adOpsTeam &&
				!req.body.adOpsTeam &&
				(req.body.permission === 'user' || req.body.permission === 'adOpsManager')
			) {
				validationErrors.push({
					param: 'email',
					value: req.body.adOpsTeam,
					location: 'body',
					msg: 'Não foi possível encontrar o adOpsTeam.',
				});
			}

			if (validationErrors.length > 0) {
				const message = validationErrors.map((err) => err.msg).join(' ');
				apiResponse.responseText = message;
				apiResponse.statusCode = 400;
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				return;
			}

			const newUser = new User(
				'',
				req.body.permission,
				req.advertiser,
				req.body.email,
				true,
				adOpsTeam,
				req.body.password
			);

			const userDAO = new UserDAO();
			userDAO
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
		}
	);
};

export default register;
