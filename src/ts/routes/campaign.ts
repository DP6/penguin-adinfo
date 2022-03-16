import { ApiResponse } from '../models/ApiResponse';
import { FileDAO } from '../models/DAO/FileDAO';
import { CampaignDAO } from '../models/DAO/CampaignDAO';
import { AdOpsTeamDAO } from '../models/DAO/AdOpsTeamDAO';
import { Campaign } from '../models/Campaign';
import { DateUtils } from '../utils/DateUtils';

const campaign = (app: { [key: string]: any }): void => {
	app.post('/campaign', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const created = DateUtils.today();
		const campaignName = req.body.campaign;
		const advertiser = req.advertiser;
		const adOpsTeam = req.body.adOpsTeam ? req.body.adOpsTeam : 'AdvertiserCampaigns';
		const campaignId = Date.now().toString(16);

		if (req.permission === 'user') {
			throw new Error('Usuário sem permissão para realizar esta ação!');
		}
		if (!campaignName) {
			throw new Error('Necessário nome da Campanha!');
		}

		const campaignObject = new Campaign(campaignName, advertiser, adOpsTeam, campaignId, true, created);

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

	app.get('/adOpsTeams/campaigns', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const advertiser = req.advertiser;
		const adOpsTeam = req.adOpsTeam;
		const permission = req.permission;

		const gettingAdOpsTeams = async () => {
			return await new AdOpsTeamDAO().getAllAdOpsTeamsFrom(advertiser, adOpsTeam, permission);
		};

		const allAdOpsTeams: string[] = await gettingAdOpsTeams();
		if (permission === 'owner' || permission === 'admin') {
			allAdOpsTeams.push('AdvertiserCampaigns');
		}
		const adOpsTeamsToReturn: {
			[key: string]: { campaignName: string; campaignId: string; adOpsTeam: string; active: boolean }[];
		}[] = [];
		for await (const adOpsTeamInfos of allAdOpsTeams) {
			try {
				const campaignsObject = await new CampaignDAO().getAllCampaignsFrom(adOpsTeamInfos, permission);
				if (campaignsObject) {
					adOpsTeamsToReturn.push({ [adOpsTeamInfos]: campaignsObject });
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
		apiResponse.responseText = JSON.stringify(adOpsTeamsToReturn);
		res.status(apiResponse.statusCode).send(apiResponse.responseText);
	});

	app.get('/campaign/:adOpsTeam/list', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const adOpsTeam = req.params.adOpsTeam !== 'Campanhas Internas' ? req.params.adOpsTeam : 'AdvertiserCampaigns';
		const permission = req.permission;

		new CampaignDAO()
			.getAllCampaignsFrom(adOpsTeam, permission)
			.then((adOpsTeams: { campaignName: string; campaignId: string }[]) => {
				apiResponse.responseText = JSON.stringify(adOpsTeams);
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

	app.get('/:adOpsTeam/:campaignId/csv/list', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		const campaignId = req.params.campaignId;

		const adOpsTeam = req.params.adOpsTeam;
		const adOpsTeamPath = adOpsTeam === 'Campanhas Internas' ? 'AdvertiserCampaigns' : adOpsTeam;
		const advertiser = req.advertiser;
		const permission = req.permission;
		const campaignObject = new CampaignDAO();
		const campaign = await campaignObject.getCampaign(campaignId);
		const fileDAO = new FileDAO();

		// uma evolucao aqui eh o owner/admin conseguir ver (e selecionar) as campanhas de todas as agencias
		if (
			(permission === 'adOpsManager' || permission === 'user') &&
			(!adOpsTeam || adOpsTeam === 'Campanhas Internas')
		) {
			apiResponse.responseText = 'Nenhuma adOpsTeam foi informada!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		} else if (!campaign) {
			apiResponse.responseText = 'Nenhuma campanha foi informada!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		}

		const filePath = `${advertiser}/${adOpsTeamPath}/${campaign}/`;

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
