import { AuthDAO } from '../models/DAO/AuthDAO';

const register = (app: { [key: string]: any }): void => {
	app.post(
		'/register',
		(req: { [key: string]: any }, res: { [key: string]: any }) => {
			const agency = req.headers.agency;
			const company = req.company;
			const token = req.headers.token;
			const permission = req.headers.permission;
			if (
				(!agency && permission === 'agency') ||
				!company ||
				!permission
			) {
				res.status(400).send({ message: 'Parâmetros incorretos!' });
				return;
			}
			const jsonPermission: { [key: string]: string } = {
				permission,
			};
			jsonPermission.company = company;
			if (permission === 'agency') {
				jsonPermission.agency = agency;
			}
			const authDAO = new AuthDAO(token);
			authDAO
				.addAuth(jsonPermission)
				.then((token) => {
					res.status(200).send(
						`Permissão adicionada para a empresa ${company}, token: ${token}`
					);
				})
				.catch((err) => {
					res.status(500).send('Falha ao criar permissão!');
				});
		}
	);
};

export default register;
