import { body } from 'express-validator';
import { User } from '../models/User';
import { UserDAO } from '../models/DAO/UserDAO';
import { ApiResponse } from '../models/ApiResponse';
import { AdOpsTeamDAO } from '../models/DAO/AdOpsTeamDAO';

const register = (app: { [key: string]: any }): void => {
	app.post(
		'/register',
		body('permission').exists().withMessage('Parâmetro permission é obrigatório.'),
		body('email').exists().withMessage('Parâmetro email é obrigatório.').isEmail().withMessage('Email inválido.'),
		body('password').exists().withMessage('Parâmetro password é obrigatório.'),
		async (req: { [key: string]: any }, res: { [key: string]: any }) => {
			const apiResponse = new ApiResponse();

			let adOpsTeam = req.body.adOpsTeam;
			const adOpsTeamDAO = new AdOpsTeamDAO();
			const userDAO = new UserDAO();

			if (req.permission === 'AdOpsTeamManager') {
				adOpsTeam = req.adOpsTeam;
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

			if (await userDAO.userExists(req.body.email)) {
				const message = 'Usuário já existe.';
				apiResponse.responseText = message;
				apiResponse.errorMessage = message;
				apiResponse.statusCode = 400;
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				return;
			}

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
				await adOpsTeamDAO.getAdOpsTeam(adOpsTeam).catch((err) => {
					apiResponse.responseText = err.message;
					apiResponse.errorMessage = err.message;
					apiResponse.statusCode = 400;
					res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
					return;
				});
			}

			new UserDAO()
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
