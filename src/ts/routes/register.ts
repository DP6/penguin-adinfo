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

			let agency = '';

			if (req.agency && req.body.permission === 'user') {
				agency = req.agency;
			} else if (req.body.agency && req.body.permission === 'agencyOwner') {
				agency = req.body.agency;
			} else if (
				!req.agency &&
				!req.body.agency &&
				(req.body.permission === 'user' || req.body.permission === 'agencyOwner')
			) {
				validationErrors.push({
					param: 'email',
					value: req.body.agency,
					location: 'body',
					msg: 'Não foi possível encontrar a agência.',
				});
			}

			if (validationErrors.length > 0) {
				const message = validationErrors.map((err) => err.msg).join(' ');
				apiResponse.responseText = message;
				apiResponse.statusCode = 400;
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				return;
			}

			const newUser = new User('', req.body.permission, req.company, req.body.email, true, agency, req.body.password);

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
