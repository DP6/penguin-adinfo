'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const FileDAO_1 = require('../models/DAO/FileDAO');
const DateUtils_1 = require('../utils/DateUtils');
const ApiResponse_1 = require('../models/ApiResponse');
const csv = (app) => {
	app.post('/csv', (req, res) => {
		const campaign = req.headers.campaign;
		const getAllAdOpsTeamsFrom = req.getAllAdOpsTeamsFrom;
		const advertiser = req.advertiser;
		const apiResponse = new ApiResponse_1.ApiResponse();
		if (!campaign) {
			apiResponse.responseText = 'Nenhuma campanha foi informada!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		} else if (!req.files || !req.files.data) {
			apiResponse.responseText = 'Nenhum arquivo foi enviado!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		}
		const content = req.files.data.data;
		const filePath = getAllAdOpsTeamsFrom
			? `${advertiser}/${getAllAdOpsTeamsFrom}/${campaign}/${DateUtils_1.DateUtils.generateDateString()}.csv`
			: `${advertiser}/${campaign}/${DateUtils_1.DateUtils.generateDateString()}.csv`;
		const fileDAO = new FileDAO_1.FileDAO();
		fileDAO.file = content;
		fileDAO
			.save(filePath)
			.then(() => {
				apiResponse.responseText = 'Arquivo salvo com sucesso!';
				apiResponse.statusCode = 200;
			})
			.catch((err) => {
				apiResponse.responseText = 'Falha ao salvar arquivo!';
				apiResponse.statusCode = 500;
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
	app.get('/csv', (req, res) => {
		const fileName = req.headers.file;
		const campaign = req.headers.campaign;
		const advertiser = req.advertiser;
		const adOpsTeamPath = req.headers.getAllAdOpsTeamsFrom ? req.headers.getAllAdOpsTeamsFrom : 'AdvertiserCampaigns';
		const apiResponse = new ApiResponse_1.ApiResponse();
		if (!fileName) {
			apiResponse.responseText = 'Nenhum arquivo foi informado!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		} else if (!campaign) {
			apiResponse.responseText = 'Nenhuma campanha foi informada!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		}
		const filePath = `${advertiser}/${adOpsTeamPath}/${campaign}/${fileName}.csv`;
		const fileDAO = new FileDAO_1.FileDAO();
		fileDAO
			.getFromStore(filePath)
			.then((file) => {
				res.setHeader('Content-disposition', 'attachment; filename=template.csv');
				res.set('Content-Type', 'text/csv; charset=utf-8');
				apiResponse.statusCode = 200;
				apiResponse.responseText = file.toString();
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = `Falha ao restaurar o arquivo ${fileName}!`;
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				if (apiResponse.statusCode === 200) {
					res.status(apiResponse.statusCode).send(apiResponse.responseText);
				} else {
					res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				}
			});
	});
	app.get('/csv/list', (req, res) => {
		const getAllAdOpsTeamsFrom = req.getAllAdOpsTeamsFrom;
		const advertiser = req.advertiser;
		const campaign = req.headers.campaign;
		const fileDAO = new FileDAO_1.FileDAO();
		let filePath = `${advertiser}/`;
		const apiResponse = new ApiResponse_1.ApiResponse();
		if (getAllAdOpsTeamsFrom) filePath += `${getAllAdOpsTeamsFrom}/`;
		if (campaign) filePath += `${campaign}/`;
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
};
exports.default = csv;
