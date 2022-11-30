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
const AdOpsTeam_1 = require('../models/AdOpsTeam');
const ApiResponse_1 = require('../models/ApiResponse');
const AdOpsTeamDAO_1 = require('../models/DAO/AdOpsTeamDAO');
const CampaignDAO_1 = require('../models/DAO/CampaignDAO');
const UserDAO_1 = require('../models/DAO/UserDAO');
const adOpsTeam = (app) => {
	app.post('/adOpsTeam', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const adOpsTeamName = req.body.name;
			const advertiser = req.advertiser;
			const adopsteamDAO = new AdOpsTeamDAO_1.AdOpsTeamDAO();
			const adOpsTeam = new AdOpsTeam_1.AdOpsTeam(adOpsTeamName, true, advertiser);
			if (yield adopsteamDAO.adOpsTeamExists(adOpsTeamName)) {
				apiResponse.statusCode = 400;
				apiResponse.responseText = 'esse AdOpsTeam já existe.';
				apiResponse.errorMessage = 'esse AdOpsTeam já existe.';
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				return;
			}
			new AdOpsTeamDAO_1.AdOpsTeamDAO()
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
		})
	);
	app.get('/adOpsTeam', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const adOpsTeamId = req.adOpsTeam;
			new AdOpsTeamDAO_1.AdOpsTeamDAO()
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
		})
	);
	app.get('/adOpsTeam/list', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const advertiser = req.advertiser;
			const permission = req.permission;
			new AdOpsTeamDAO_1.AdOpsTeamDAO()
				.getAllAdOpsTeamsFrom(advertiser, permission)
				.then((adOpsTeams) => {
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
		})
	);
	app.post('/adOpsTeam/:adOpsTeam/deactivate', (req, res) => {
		const apiResponse = new ApiResponse_1.ApiResponse();
		const adOpsTeamTarget = req.params.adOpsTeam;
		new AdOpsTeamDAO_1.AdOpsTeamDAO()
			.deactivateAdOpsTeam(adOpsTeamTarget)
			.then((result) => {
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
	app.post('/adOpsTeam/:adOpsTeam/reactivate', (req, res) => {
		const apiResponse = new ApiResponse_1.ApiResponse();
		const adOpsTeamTarget = req.params.adOpsTeam;
		new AdOpsTeamDAO_1.AdOpsTeamDAO()
			.reactivateAdOpsTeam(adOpsTeamTarget)
			.then((result) => {
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
	app.get('/adOpsTeam/users', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const advertiser = req.advertiser;
			const adOpsTeam = req.adOpsTeam;
			new UserDAO_1.UserDAO()
				.getAllUsersFromAdOpsTeam(advertiser, adOpsTeam)
				.then((users) => {
					apiResponse.responseText = JSON.stringify(users.map((user) => user.toJson()));
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
	app.get('/adOpsTeam/:adOpsTeam/users', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const advertiser = req.advertiser;
			const adOpsTeam = req.params.adOpsTeam;
			new UserDAO_1.UserDAO()
				.getAllUsersFromAdOpsTeam(advertiser, adOpsTeam)
				.then((users) => {
					apiResponse.responseText = JSON.stringify(users.map((user) => user.toJson()));
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
	app.get('/adOpsTeam/campaigns', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const advertiser = req.advertiser;
			const adOpsTeam = req.adOpsTeam;
			new CampaignDAO_1.CampaignDAO()
				.getAllCampaignsFromAdOpsTeam(advertiser, adOpsTeam)
				.then((campaigns) => {
					apiResponse.responseText = JSON.stringify(campaigns.map((campaign) => campaign.toJson()));
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
	app.get('/adOpsTeam/:adOpsTeam/campaigns', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const advertiser = req.advertiser;
			const adOpsTeam = req.params.adOpsTeam;
			new CampaignDAO_1.CampaignDAO()
				.getAllCampaignsFromAdOpsTeam(advertiser, adOpsTeam)
				.then((campaigns) => {
					apiResponse.responseText = JSON.stringify(campaigns.map((campaign) => campaign.toJson()));
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
};
exports.default = adOpsTeam;
