import { AuthDAO } from '../models/DAO/AuthDAO';
import { ApiResponse } from '../models/ApiResponse';
import { Auth } from '../models/Auth';

const user = (app: { [key: string]: any }): void => {
	app.get('/user', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		new AuthDAO(req.headers.token)
			.getAuth()
			.then((auth: Auth) => {
				apiResponse.responseText = JSON.stringify(auth.toJson());
				apiResponse.statusCode = 200;
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = 'Falha ao recuperar o usuário!';
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
};

export default user;
