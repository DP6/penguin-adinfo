import { ApiResponse } from '../models/ApiResponse';
import { UserDAO } from '../models/DAO/UserDAO';
import { JWT } from '../models/JWT';
import { User } from '../models/User';

const login = (app: { [key: string]: any }): void => {
	app.post('/login', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		new UserDAO(req.body.email, req.body.password)
			.getUser()
			.then((user: User) => {
				const token = new JWT(user).createToken();
				res.set('Authorization', token);
				apiResponse.statusCode = 204;
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

export default login;
