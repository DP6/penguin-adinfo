import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import { UserDAO } from '../models/DAO/UserDAO';
import { ApiResponse } from '../models/ApiResponse';
import { AdOpsTeamDAO } from '../models/DAO/AdOpsTeamDAO';
import { AdOpsTeamMissingError } from '../Errors/AdOpsTeamMissingError';

const register = (app: { [key: string]: any }): void => {
	app.post(
		'/register',
		body('permission').exists().withMessage('Parâmetro permission é obrigatório.'),
		body('email').exists().withMessage('Parâmetro email é obrigatório.').isEmail().withMessage('Email inválido.'),
		body('password').exists().withMessage('Parâmetro password é obrigatório.'),
		(req: { [key: string]: any }, res: { [key: string]: any }) => {
			const apiResponse = new ApiResponse();

			const adOpsTeam = req.body.adOpsTeam;
			const adOpsTeamDAO = new AdOpsTeamDAO();

			const newUser = new User(
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
					const userDAO = new UserDAO();
					userDAO.addUser(newUser);
				})
				.then(() => {
					const message = `Usuário criado para o email ${newUser.email}`;
					apiResponse.responseText = message;
					apiResponse.statusCode = 200;
				})
				.catch((err) => {
					if (err.name === 'AdOpsTeamMissingError') {
						const message = err.message;
						apiResponse.responseText = message;
						apiResponse.errorMessage = err.message;
						apiResponse.statusCode = 400;
					} else {
						const message = 'Falha ao criar permissão!';
						apiResponse.responseText = message;
						apiResponse.errorMessage = err.message;
						apiResponse.statusCode = 500;
					}
				})
				.finally(() => {
					res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				});
		}
	);
};

export default register;
