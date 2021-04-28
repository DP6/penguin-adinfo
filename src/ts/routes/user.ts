import { AuthDAO } from '../models/DAO/AuthDAO';

const user = (app: { [key: string]: any }): void => {
	app.get('/user', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		new AuthDAO(req.headers.token)
			.getAuth()
			.then((data) => {
				if (data) {
					res.status(200).send(JSON.stringify(data.toJson()));
				} else {
					res.status(200).send(JSON.stringify('{}'));
				}
			})
			.catch((err) => {
				res.status(500).send('Falha ao recuperar o usuário!');
			});
	});
};

export default user;
