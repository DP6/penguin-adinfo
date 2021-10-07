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
const campaign = (app) => {
	app.get('/campaign', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			console.log(req.headers);
			console.log(req.permission);
			const agency = req.agency;
			const companyCampaignsFolder = 'CompanyCampaigns';
			const company = req.company;
			const campaign = req.headers.campaign;
			const permission = req.permission;
			const fileDAO = new FileDAO_1.FileDAO();
			const filePath = agency ? `${company}/${agency}/` : `${company}/${companyCampaignsFolder}/`;
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
	app.get('/campaign/list', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			console.log(req.headers);
			console.log(req.permission);
			const agency = req.agency;
			const companyCampaignsFolder = 'CompanyCampaigns';
			const company = req.company;
			const campaign = req.headers.campaign;
			const permission = req.permission;
			const fileDAO = new FileDAO_1.FileDAO();
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
			const today = new Date();
			const day = String(today.getDate()).padStart(2, '0');
			const month = String(today.getMonth() + 1).padStart(2, '0');
			const year = today.getFullYear();
			const created = `${year}-${month}-${day}`;
			const campaignName = req.headers.campaign;
			const company = req.company;
			const agency = req.agency ? req.agency : 'CompanyCampaigns';
			const campaignId = Date.now().toString(16);
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
	app.post('/campaign/deactivate', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const campaign = req.headers.campaign;
			const agency = req.agency ? req.agency : 'CompanyCampaigns';
			const permission = 'agencyOwner';
			new CampaignDAO_1.CampaignDAO()
				.deactivateCampaign(campaign, agency, permission)
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
	app.post('/campaign/reactivate', (req, res) => {
		const apiResponse = new ApiResponse_1.ApiResponse();
		const campaign = req.headers.campaign;
		const agency = req.agency ? req.agency : 'CompanyCampaigns';
		const permission = 'agencyOwner';
		new CampaignDAO_1.CampaignDAO()
			.reactivateCampaign(campaign, agency, permission)
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
