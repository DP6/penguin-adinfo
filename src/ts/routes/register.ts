import { AuthDAO } from '../models/DAO/AuthDAO';

const register = (app: { [key: string]: any }): void => {
	app.post('/register', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const agency = req.headers.agency;
		const company = req.company;
		const token = req.headers.token;
		const email = req.headers.email;
		const permission = req.headers.permission;
		if ((!agency && permission === 'user') || !company || !permission || !email) {
			res.status(400).send({ message: 'Parâmetros incorretos!' });
			return;
		}
		const jsonPermission: { [key: string]: string } = {
			permission,
		};
		jsonPermission.company = company;
		if (permission === 'user') {
			jsonPermission.agency = agency;
			jsonPermission.email = email;
		}
		const authDAO = new AuthDAO(token);
		authDAO
			.addAuth(jsonPermission)
			.then((token) => {
				res.status(200).send(`Permissão adicionada para o email ${email}, senha: ${token}`);
			})
			.catch((err) => {
				res.status(500).send('Falha ao criar permissão!');
			});
	});
};

export default register;
