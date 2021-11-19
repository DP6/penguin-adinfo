import { ApiResponse } from '../models/ApiResponse';
import { FileDAO } from '../models/DAO/FileDAO';
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
				const campaignsObject = await new CampaignDAO().getAllCampaignsFrom(company, agencyInfos, permission);
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

	app.get('/campaign/:agency/list', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const company = req.company;
		const agency = req.params.agency !== 'Campanhas Internas' ? req.params.agency : 'CompanyCampaigns';
		const permission = req.permission;

		new CampaignDAO()
			.getAllCampaignsFrom(company, agency, permission)
			.then((agencies: { campaignName: string; campaignId: string }[]) => {
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

		// uma evolucao aqui eh o owner/admin conseguir ver (e selecionar) as campanhas de todas as agencias
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
