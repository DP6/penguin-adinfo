import { ApiResponse } from '../models/ApiResponse';
import { UserDAO } from '../models/DAO/UserDAO';
import { User } from '../models/User';

const user = (app: { [key: string]: any }): void => {
	app.get('/user', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		const user = {
			permission: req.permission,
			agency: req.agency,
			company: req.company,
			email: req.email,
		};
		apiResponse.statusCode = 200;
		apiResponse.responseText = JSON.stringify(user);

		res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
	});

	app.post('/user/changepass', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		new UserDAO(req.email, req.body.password)
			.getUser()
			.then((user: User) => {
				user.password = req.body.newPassword;
				return new UserDAO().changePassword(user);
			})
			.then((result: boolean) => {
				if (result) {
					apiResponse.statusCode = 200;
					apiResponse.responseText = 'Senha alterada com sucesso!';
				} else {
					throw new Error('Erro ao modificar a senha!');
				}
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = 'Email e/ou senha incorreto(s)!';
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
};

export default user;
