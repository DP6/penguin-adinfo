// import { CampaignDAO } from '../models/DAO/CampaignDAO';
import { ApiResponse } from '../models/ApiResponse';
import { FirestoreConnectionSingleton } from '../models/cloud/FirestoreConnectionSingleton';
import { FileDAO } from '../models/DAO/FileDAO';
import { Firestore } from '@google-cloud/firestore';
import { UserDAO } from '../models/DAO/UserDAO';
import { CampaignDAO } from '../models/DAO/CampaignDAO';
import { Campaign } from '../models/Campaign';

const campaign = (app: { [key: string]: any }): void => {
	app.get('/campaign', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		console.log(req.headers);
		console.log(req.permission);

		const agency = req.agency;
		const companyCampaignsFolder = 'CompanyCampaigns';
		const company = req.company;
		const campaign = req.headers.campaign;
		const permission = req.permission;
		const fileDAO = new FileDAO();

		const filePath = agency ? `${company}/${agency}/` : `${company}/${companyCampaignsFolder}/`;

		//se o user for adm ou owner, devemos retonarnar todas as agencias tbm

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

	//revisar list
	app.get('/campaign/list', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		console.log(req.headers);
		console.log(req.permission);

		const agency = req.agency;
		const companyCampaignsFolder = 'CompanyCampaigns';
		const company = req.company;
		const campaign = req.headers.campaign;
		const permission = req.permission;
		const fileDAO = new FileDAO();

		// uma evolucao aqui eh o owner/admin conseguir ver (e selecionar) as campanhas de todas as agencias
		if ((permission !== 'admin' || permission !== 'owner') && !agency) {
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

		const filePath = agency ? `${company}/${agency}/${campaign}/` : `${company}/${companyCampaignsFolder}/${campaign}/`;

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

	app.post('/campaign/add', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const today = new Date();
		const day = String(today.getDate()).padStart(2, '0');
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const year = today.getFullYear();
		const created = `${year}-${month}-${day}`;
		const campaignName = req.headers.campaign;
		const company = req.company;
		const agency = req.agency ? req.agency : 'CompanyCampaigns';
		const campaignId = Date.now().toString(16);

		const campaignObject = new Campaign(campaignName, company, agency, campaignId, true, created);

		new CampaignDAO()
			.addCampaign(campaignObject)
			.then((result: boolean) => {
				if (result) {
					apiResponse.statusCode = 200;
					apiResponse.responseText = 'Campanha criada com sucesso!';
				} else {
					throw new Error('Erro ao criar campanha!');
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

	app.post('/campaign/deactivate', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const campaign = req.headers.campaign;
		const agency = req.agency ? req.agency : 'CompanyCampaigns';
		const permission = 'agencyOwner'; // mudar para -> req.permission

		new CampaignDAO()
			.deactivateCampaign(campaign, agency, permission)
			.then((result: boolean) => {
				if (result) {
					apiResponse.statusCode = 200;
					apiResponse.responseText = 'Campanha desativada com sucesso!';
				} else {
					throw new Error('Erro ao desativar campanha!');
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

	app.post('/campaign/reactivate', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		const campaign = req.headers.campaign;
		const agency = req.agency ? req.agency : 'CompanyCampaigns';
		const permission = 'agencyOwner'; // mudar para -> req.permission

		new CampaignDAO()
			.reactivateCampaign(campaign, agency, permission)
			.then((result: boolean) => {
				if (result) {
					apiResponse.statusCode = 200;
					apiResponse.responseText = 'Campanha reativada com sucesso!';
				} else {
					throw new Error('Erro ao reativar campanha!');
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

export default campaign;
