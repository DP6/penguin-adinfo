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
const FileDAO_1 = require('../models/DAO/FileDAO');
const CampaignDAO_1 = require('../models/DAO/CampaignDAO');
const Campaign_1 = require('../models/Campaign');
const DateUtils_1 = require('../utils/DateUtils');
const campaign = (app) => {
	app.get('/agency/list', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const company = req.company;
			const agency = req.agency;
			const permission = req.permission;
			new CampaignDAO_1.CampaignDAO()
				.getAllAgenciesFrom(company, agency, permission)
				.then((agencies) => {
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
		})
	);
	app.get('/campaign/:agency/list', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const agency = req.params.agency;
			const permission = req.permission;
			new CampaignDAO_1.CampaignDAO()
				.getAllCampaignsFrom(agency, permission)
				.then((agencies) => {
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
		})
	);
	app.get('/campaign/:id/csv/list', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const targetId = req.params.id;
			const agency = req.agency;
			const companyCampaignsFolder = 'CompanyCampaigns';
			const company = req.company;
			const permission = req.permission;
			const campaignObject = new CampaignDAO_1.CampaignDAO();
			const campaign = yield campaignObject.getCampaign(targetId);
			const fileDAO = new FileDAO_1.FileDAO();
			if ((permission === 'agencyOwner' || permission === 'user') && !agency) {
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
			const filePath = agency
				? `${company}/${agency}/${campaign}/`
				: `${company}/${companyCampaignsFolder}/${campaign}/`;
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
		})
	);
	app.post('/campaign/add', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const created = DateUtils_1.DateUtils.today();
			const campaignName = req.headers.campaign;
			const company = req.company;
			const agency = req.agency ? req.agency : 'CompanyCampaigns';
			const campaignId = Date.now().toString(16);
			if (req.permission === 'user') {
				throw new Error('Usuário sem permissão para realizar esta ação!');
			}
			const campaignObject = new Campaign_1.Campaign(campaignName, company, agency, campaignId, true, created);
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
					apiResponse.responseText = 'Email e/ou senha incorreto(s)!';
					apiResponse.errorMessage = err.message;
				})
				.finally(() => {
					res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				});
		})
	);
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
					apiResponse.responseText = 'Email e/ou senha incorreto(s)!';
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
				apiResponse.responseText = 'Email e/ou senha incorreto(s)!';
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
};
exports.default = campaign;
