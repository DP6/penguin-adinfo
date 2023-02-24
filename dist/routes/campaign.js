'use strict';
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
Object.defineProperty(exports, '__esModule', { value: true });
const ApiResponse_1 = require('../models/ApiResponse');
const CampaignDAO_1 = require('../models/DAO/CampaignDAO');
const Campaign_1 = require('../models/Campaign');
const DateUtils_1 = require('../utils/DateUtils');
const campaign = (app) => {
	app.post('/campaign', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const created = DateUtils_1.DateUtils.today();
			const campaignName = req.body.campaign;
			const advertiser = req.advertiser;
			const adOpsTeam = req.body.adOpsTeam ? req.body.adOpsTeam : 'AdvertiserCampaigns';
			const campaignDAO = new CampaignDAO_1.CampaignDAO();
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
			const campaignObject = new Campaign_1.Campaign(campaignName, advertiser, adOpsTeam, '', true, created);
			if (yield campaignDAO.campaignExists(campaignName)) {
				apiResponse.statusCode = 400;
				apiResponse.responseText = 'essa campanha já existe!';
				apiResponse.errorMessage = 'essa campanha já existe!';
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				return;
			}
			new CampaignDAO_1.CampaignDAO()
				.addCampaign(campaignObject)
				.then((result) => {
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
		})
	);
	app.delete('/campaign/:id/delete', (req, res) => {
		const apiResponse = new ApiResponse_1.ApiResponse();
		const targetCampaignId = req.params.id;
		const campaignDAO = new CampaignDAO_1.CampaignDAO();
		campaignDAO
			.getCampaignById(targetCampaignId)
			.then((campaign) => {
				if (req.permission === 'adOpsManager' && campaign.adOpsTeam !== req.adOpsTeam)
					throw new Error('Usuário sem permissão');
				return campaignDAO.deleteCampaign(targetCampaignId);
			})
			.then((result) => {
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

	app.post('/campaign/:id/deactivate', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const campaignId = req.params.id;
			const permission = req.permission;
			new CampaignDAO_1.CampaignDAO()
				.deactivateCampaign(campaignId, permission)
				.then((result) => {
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
		})
	);
	app.post('/campaign/:id/reactivate', (req, res) => {
		const apiResponse = new ApiResponse_1.ApiResponse();
		const campaignId = req.params.id;
		const permission = req.permission;
		new CampaignDAO_1.CampaignDAO()
			.reactivateCampaign(campaignId, permission)
			.then((result) => {
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
exports.default = campaign;
