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
			apiResponse.statusCode = 400;
			apiResponse.responseText = 'Necessário nome da Campanha!';
			apiResponse.errorMessage = 'Necessário nome da Campanha!';
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
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

	app.get('/campaign/:adOpsTeam/list', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		const adOpsTeam = req.params.adOpsTeam === ':adOpsTeam' ? '' : req.params.adOpsTeam;
		const permission = req.permission;
		const advertiser = req.advertiser;

		if ((req.permission === 'owner' || req.permission === 'admin') && !req.params.adOpsTeam) {
			new CampaignDAO()
				.getAllCampaigns(advertiser)
				.then((campanha: Campaign[]) => {
					apiResponse.responseText = JSON.stringify(campanha);
				})
				.catch((err) => {
					apiResponse.statusCode = 500;
					apiResponse.responseText = err.message;
					apiResponse.errorMessage = err.message;
				})
				.finally(() => {
					res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				});
		} else {
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
		}
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

	app.delete('/campaign/:id/delete', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const targetCampaignId = req.params.id;
		const campaignDAO = new CampaignDAO();

		campaignDAO
			.getCampaignById(targetCampaignId)
			.then((campaign: Campaign) => {
				if (req.permission === 'adOpsManager' && campaign.adOpsTeam !== req.adOpsTeam)
					throw new Error('Usuário sem permissão');
				return campaignDAO.deleteCampaign(targetCampaignId);
			})
			.then((result: boolean) => {
				if (result) {
					apiResponse.statusCode = 200;
					apiResponse.responseText = 'Campanha deletada com sucesso!';
				} else {
					throw new Error('Erro ao deletar campanha!');
				}
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

	app.post('/campaign/:id/deactivate', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		const campaignId = req.params.id;
		const permission = req.permission;
		const userAdOpsTeam = req.adOpsTeam;
		const AdopsCampaign = await new CampaignDAO().getAdopsteamCampaign(campaignId);

		if (permission != 'user' && userAdOpsTeam === AdopsCampaign) {
			new CampaignDAO()
				.deactivateCampaign(campaignId)
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
		} else {
			apiResponse.statusCode = 500;
			apiResponse.responseText = 'Erro ao desativar Campanha!';
			apiResponse.errorMessage = 'Erro ao desativar Campanha!';
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
		}
	});

	app.post('/campaign/:id/reactivate', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		const campaignId = req.params.id;
		const permission = req.permission;
		const userAdOpsTeam = req.adOpsTeam;
		const AdopsCampaign = await new CampaignDAO().getAdopsteamCampaign(campaignId);

		if (permission != 'user' && userAdOpsTeam === AdopsCampaign) {
			new CampaignDAO()
				.reactivateCampaign(campaignId)
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
		} else {
			apiResponse.statusCode = 500;
			apiResponse.responseText = 'Erro ao reativar Campanha!';
			apiResponse.errorMessage = 'Erro ao reativar Campanha!';
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
		}
	});
};

export default campaign;
