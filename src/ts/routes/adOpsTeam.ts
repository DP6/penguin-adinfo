import { AdOpsTeam } from '../models/AdOpsTeam';
import { ApiResponse } from '../models/ApiResponse';
import { Campaign } from '../models/Campaign';
import { AdOpsTeamDAO } from '../models/DAO/AdOpsTeamDAO';
import { CampaignDAO } from '../models/DAO/CampaignDAO';
import { UserDAO } from '../models/DAO/UserDAO';
import { User } from '../models/User';

const adOpsTeam = (app: { [key: string]: any }): void => {
	app.post('/adOpsTeam', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		const adOpsTeamName = req.body.name;
		const advertiser = req.advertiser;
		const adopsteamDAO = new AdOpsTeamDAO();

		const adOpsTeam = new AdOpsTeam(adOpsTeamName, true, advertiser);

		if (await adopsteamDAO.adOpsTeamExists(adOpsTeamName)) {
			apiResponse.statusCode = 400;
			apiResponse.responseText = 'esse AdOpsTeam já existe.';
			apiResponse.errorMessage = 'esse AdOpsTeam já existe.';
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		}

		new AdOpsTeamDAO()
			.addAdOpsTeam(adOpsTeam)
			.then((status) => {
				if (status) apiResponse.responseText = 'AdOpsTeam criado com sucesso!';
				else throw new Error('Erro ao criar o AdopsTeam!');
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

	app.get('/adOpsTeam', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const adOpsTeamId = req.adOpsTeam;

		new AdOpsTeamDAO()
			.getAdOpsTeam(adOpsTeamId)
			.then((adOpsTeam) => {
				apiResponse.responseText = JSON.stringify(adOpsTeam.toJson());
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

	app.get('/adOpsTeam/list', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const advertiser = req.advertiser;
		const permission = req.permission;

		new AdOpsTeamDAO()
			.getAllAdOpsTeamsFrom(advertiser, permission)
			.then((adOpsTeams: AdOpsTeam[]) => {
				apiResponse.responseText = JSON.stringify(adOpsTeams.map((adOpsTeam) => adOpsTeam.toJson()));
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

	app.delete('/adOpsTeam/:adOpsTeam/delete', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const targetAdOpsTeamId = req.params.id;
		const adOpsTeamDAO = new AdOpsTeamDAO();

		if (req.permission !== 'owner' || req.permission !== 'admin') throw new Error('Usuário sem permissão');
		return adOpsTeamDAO
			.deleteAdopsteam(targetAdOpsTeamId)
			.then((result: boolean) => {
				if (result) {
					apiResponse.statusCode = 200;
					apiResponse.responseText = 'AdOpsTeam deletado com sucesso!';
				} else {
					throw new Error('Erro ao deletar adOpsTeam!');
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

	app.post('/adOpsTeam/:adOpsTeam/deactivate', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const adOpsTeamTarget = req.params.adOpsTeam;

		new AdOpsTeamDAO()
			.deactivateAdOpsTeam(adOpsTeamTarget)
			.then((result: boolean) => {
				if (result) {
					apiResponse.statusCode = 200;
					apiResponse.responseText = 'AdOpsTeam desativado com sucesso!';
				} else {
					throw new Error('Erro ao desativar adOpsTeam!');
				}
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = '';
				apiResponse.errorMessage = err.message.match('NOT_FOUND: No document to update')
					? 'AdOpsTeam incorreto!'
					: err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});

	app.post('/adOpsTeam/:adOpsTeam/reactivate', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const adOpsTeamTarget = req.params.adOpsTeam;

		new AdOpsTeamDAO()
			.reactivateAdOpsTeam(adOpsTeamTarget)
			.then((result: boolean) => {
				if (result) {
					apiResponse.statusCode = 200;
					apiResponse.responseText = 'AdOpsTeam reativado com sucesso!';
				} else {
					throw new Error('Erro ao reativar adOpsTeam!');
				}
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = '';
				apiResponse.errorMessage = err.message.match('NOT_FOUND: No document to update')
					? 'AdOpsTeam incorreto!'
					: err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});

	app.get('/adOpsTeam/users', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		const advertiser = req.advertiser;
		const adOpsTeam = req.adOpsTeam;

		new UserDAO()
			.getAllUsersFromAdOpsTeam(advertiser, adOpsTeam)
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

	app.get('/adOpsTeam/:adOpsTeam/users', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		const advertiser = req.advertiser;
		const adOpsTeam = req.params.adOpsTeam;

		new UserDAO()
			.getAllUsersFromAdOpsTeam(advertiser, adOpsTeam)
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

	app.get('/adOpsTeam/campaigns', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		const advertiser = req.advertiser;
		const adOpsTeam = req.adOpsTeam;

		new CampaignDAO()
			.getAllCampaignsFromAdOpsTeam(advertiser, adOpsTeam)
			.then((campaigns: Campaign[]) => {
				apiResponse.responseText = JSON.stringify(campaigns.map((campaign: Campaign) => campaign.toJson()));
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

	app.get('/adOpsTeam/:adOpsTeam/campaigns', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		const advertiser = req.advertiser;
		const adOpsTeam = req.params.adOpsTeam;

		new CampaignDAO()
			.getAllCampaignsFromAdOpsTeam(advertiser, adOpsTeam)
			.then((campaigns: Campaign[]) => {
				apiResponse.responseText = JSON.stringify(campaigns.map((campaign: Campaign) => campaign.toJson()));
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
export default adOpsTeam;
