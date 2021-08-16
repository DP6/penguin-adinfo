import { ApiResponse } from '../models/ApiResponse';

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
};

export default user;
