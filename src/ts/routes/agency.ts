import { ApiResponse } from '../models/ApiResponse';
import { AgencyDAO } from '../models/DAO/AgencyDAO';
import { User } from '../models/User';

const agency = (app: { [key: string]: any }): void => {
	app.get('/agency/list', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const company = req.company;
		const agency = req.agency;
		const permission = req.permission;

		new AgencyDAO()
			.getAllAgenciesFrom(company, agency, permission)
			.then((agencies: string[]) => {
				apiResponse.responseText = JSON.stringify(agencies);
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = err.message;
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});

	app.get('/agency/users', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		const company = req.company;
		const agency = req.agency;

		new AgencyDAO()
			.getAllUsersFromAgency(company, agency)
			.then((users: User[]) => {
				apiResponse.responseText = JSON.stringify(users.map((user: User) => user.toJson()));
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = err.message;
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
};
export default agency;
