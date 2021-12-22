import { ApiResponse } from '../models/ApiResponse';
import { CampaignDAO } from '../models/DAO/CampaignDAO';
import { AgencyDAO } from '../models/DAO/AgencyDAO';
import { Campaign } from '../models/Campaign';
import { DateUtils } from '../utils/DateUtils';

const campaign = (app: { [key: string]: any }): void => {
	app.post('/campaign', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const created = DateUtils.today();
		const campaignName = req.body.campaign;
		const company = req.company;
		const agency = req.body.agency ? req.body.agency : 'CompanyCampaigns';
		const campaignId = Date.now().toString(16);

		if (req.permission === 'user') {
			throw new Error('Usuário sem permissão para realizar esta ação!');
		}
		if (!campaignName) {
			throw new Error('Necessário nome da Campanha!');
		}

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
				apiResponse.responseText = 'Erro ao criar campanha!';
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});

	app.get('/agencies/campaigns', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const company = req.company;
		const agency = req.agency;
		const permission = req.permission;

		const gettingAgencies = async () => {
			return await new AgencyDAO().getAllAgenciesFrom(company, agency, permission);
		};

		const allAgencies: string[] = await gettingAgencies();
		if (permission === 'owner' || permission === 'admin') {
			allAgencies.push('CompanyCampaigns');
		}
		if (permission === 'admin' || permission === ' owner') allAgencies.push('Campanhas Internas');
		const agenciesToReturn: {
			[key: string]: { campaignName: string; campaignId: string; agency: string; activate: boolean }[];
		}[] = [];
		for await (const agencyInfos of allAgencies) {
			try {
				const campaignsObject = await new CampaignDAO().getAllCampaignsFrom(agencyInfos, permission);
				if (campaignsObject) {
					agenciesToReturn.push({ [agencyInfos]: campaignsObject });
				}
			} catch (err) {
				apiResponse.statusCode = 500;
				apiResponse.responseText = 'Erro ao resgatar a campanha!';
				apiResponse.errorMessage = err.message;
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				return;
			}
		}
		apiResponse.statusCode = 200;
		apiResponse.responseText = JSON.stringify(agenciesToReturn);
		res.status(apiResponse.statusCode).send(apiResponse.responseText);
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
