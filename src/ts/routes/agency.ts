import { ApiResponse } from '../models/ApiResponse';
import { AgencyDAO } from '../models/DAO/AgencyDAO';
import { FileDAO } from '../models/DAO/FileDAO';
import { CampaignDAO } from '../models/DAO/CampaignDAO';
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
		const permission = req.permission;

		new AgencyDAO()
			.getAllUsersFromAgency(company, agency, permission)
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

	app.get('/:agency/:campaignId/csv/list', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		const campaignId = req.params.campaignId;

		const agency = req.params.agency;
		const agencyPath = agency === 'Campanhas Internas' ? 'CompanyCampaigns' : agency;
		const company = req.company;
		const permission = req.permission;
		const campaignObject = new CampaignDAO();
		const campaign = await campaignObject.getCampaign(campaignId);
		const fileDAO = new FileDAO();

		if ((permission === 'agencyOwner' || permission === 'user') && (!agency || agency === 'Campanhas Internas')) {
			apiResponse.responseText = 'Nenhuma agência foi informada!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		} else if (!campaign) {
			apiResponse.responseText = 'Nenhuma campanha foi informada!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		}

		const filePath = `${company}/${agencyPath}/${campaign}/`;

		fileDAO
			.getAllFilesFromStore(filePath)
			.then((data) => {
				const files = data[0].filter((file) => /\.csv$/.test(file.name)).map((file) => file.name);
				apiResponse.responseText = files.join(',');
				apiResponse.statusCode = 200;
			})
			.catch((err) => {
				apiResponse.errorMessage = err.message;
				apiResponse.responseText = `Falha ao restaurar os arquivos!`;
				apiResponse.statusCode = 500;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
};
export default agency;
