import { header, validationResult } from 'express-validator';
import { Auth } from '../models/Auth';
import { AuthDAO } from '../models/DAO/AuthDAO';

const register = (app: { [key: string]: any }): void => {
	app.post(
		'/register',
		header('permission').exists().withMessage('Parâmetro permission é obrigatório.'),
		header('company').exists().withMessage('Parâmetro company é obrigatório.'),
		header('email').exists().withMessage('Parâmetro email é obrigatório.').isEmail().withMessage('Email inválido.'),
		(req: { [key: string]: any }, res: { [key: string]: any }) => {
			const validationErrors = validationResult(req).array();
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

			const newUserAuth = new Auth(
				req.headers.permission,
				req.headers.company,
				req.headers.permission === 'user' ? req.headers.agency : '',
				req.headers.email
			);

			const token = req.headers.token;
			const authDAO = new AuthDAO(token);
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

export default register;
