import { ApiResponse } from '../models/ApiResponse';
import { FileDAO } from '../models/DAO/FileDAO';
import { CampaignDAO } from '../models/DAO/CampaignDAO';
import { Campaign } from '../models/Campaign';
import { DateUtils } from '../utils/DateUtils';

const campaign = (app: { [key: string]: any }): void => {
	app.post('/campaign', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const created = DateUtils.today();
		const campaignName = req.body.campaign;
		const advertiser = req.advertiser;
		const adOpsTeam = req.body.adOpsTeam ? req.body.adOpsTeam : 'AdvertiserCampaigns';
		const campaignDAO = new CampaignDAO();

		//TODO RETIRAR
		if (req.permission === 'user') {
			throw new Error('Usuário sem permissão para realizar esta ação!');
		}
		if (!campaignName) {
			throw new Error('Necessário nome da Campanha!');
		}

		const campaignObject = new Campaign(campaignName, advertiser, adOpsTeam, '', true, created);

		if (await campaignDAO.campaignExists(campaignName)) {
			apiResponse.statusCode = 400;
			apiResponse.responseText = 'essa campanha já existe!';
			apiResponse.errorMessage = 'essa campanha já existe!';
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		}

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
				apiResponse.responseText = 'Erro ao criar campanha!';
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});

	app.post('/campaign/:id/deactivate', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		const campaignId = req.params.id;
		const permission = req.permission;

		new CampaignDAO()
			.deactivateCampaign(campaignId, permission)
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
				apiResponse.responseText = 'Erro ao desativar campanha!';
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});

	app.post('/campaign/:id/reactivate', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		const campaignId = req.params.id;
		const permission = req.permission;

		new CampaignDAO()
			.reactivateCampaign(campaignId, permission)
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
				apiResponse.responseText = 'Erro ao reativar campanha!';
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
};

export default campaign;
