import { ApiResponse } from '../models/ApiResponse';
import { BlockList } from '../models/BlockList';
import { UserDAO } from '../models/DAO/UserDAO';
import { JWT } from '../models/JWT';
import { User } from '../models/User';

const login = (app: { [key: string]: any }): void => {
	app.post('/login', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		new UserDAO(req.body.email, req.body.password)
			.getUser()
			.then((user: User) => {
				if (user.active) {
					const token = new JWT(user).createToken();
					res.set('Authorization', token);
					apiResponse.statusCode = 204;
				} else {
					apiResponse.statusCode = 403;
					apiResponse.responseText = 'Usuário desativado!';
					apiResponse.errorMessage = 'Usuário desativado!';
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

	app.post('/logout', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		try {
			await new BlockList().addToken(req.token);
			apiResponse.statusCode = 200;
			apiResponse.responseText = 'Logout efetuado com sucesso!';
		} catch (err) {
			apiResponse.statusCode = 500;
			apiResponse.responseText = 'Falha ao efetuar o logout!';
			apiResponse.errorMessage = err.message;
		}

		res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
	});
};

export default login;
