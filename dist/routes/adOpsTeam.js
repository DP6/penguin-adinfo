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
const AdOpsTeamDAO_1 = require('../models/DAO/AdOpsTeamDAO');
const adOpsTeam = (app) => {
	app.get('/adOpsTeam/list', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const advertiser = req.advertiser;
			const adOpsTeam = req.adOpsTeam;
			const permission = req.permission;
			new AdOpsTeamDAO_1.AdOpsTeamDAO()
				.getAllAdOpsTeamsFrom(advertiser, adOpsTeam, permission)
				.then((adOpsTeams) => {
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
		})
	);
	app.get('/adOpsTeam/users', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const advertiser = req.advertiser;
			const adOpsTeam = req.adOpsTeam;
			new AdOpsTeamDAO_1.AdOpsTeamDAO()
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
};
exports.default = adOpsTeam;
