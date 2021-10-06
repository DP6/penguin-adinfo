'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const ConfigDAO_1 = require('../models/DAO/ConfigDAO');
const FileDAO_1 = require('../models/DAO/FileDAO');
const DateUtils_1 = require('../utils/DateUtils');
const CsvUtils_1 = require('../utils/CsvUtils');
const Builder_1 = require('../controllers/Builder');
const ApiResponse_1 = require('../models/ApiResponse');
const converter = require('json-2-csv');
const build = (app) => {
	app.post('/build/:media', (req, res) => {
		const media = req.params.media;
		const company = req.company;
		const agency = req.agency;
		const ownerAgency = 'CompanyCampaigns';
		const campaign = req.headers.campaign;
		const apiResponse = new ApiResponse_1.ApiResponse();
		if (!req.files || !req.files.data) {
			apiResponse.responseText = 'Nenhum arquivo foi enviado!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		} else if (!campaign) {
			apiResponse.responseText = 'Nenhuma campanha foi informada!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		}
		const fileContent = req.files.data.data;
		const filePath = agency
			? `${company}/${agency}/${campaign}/${DateUtils_1.DateUtils.generateDateString()}.csv`
			: `${company}/${ownerAgency}/${campaign}/${DateUtils_1.DateUtils.generateDateString()}.csv`;
		let companyConfig;
		const configDAO = new ConfigDAO_1.ConfigDAO(company);
		configDAO
			.getLastConfig()
			.then((config) => {
				companyConfig = config;
				if (companyConfig) {
					if (!companyConfig.toJson()[media]) {
						apiResponse.statusCode = 400;
						throw new Error(`Mídia ${media} não foi configurada!`);
					}
					const fileDAO = new FileDAO_1.FileDAO();
					fileDAO.file = fileContent;
					return fileDAO.save(filePath);
				} else {
					apiResponse.statusCode = 500;
					throw new Error('Nenhuma configuração encontrada!');
				}
			})
			.then(() => {
				const csvContent = fileContent.toString();
				const separator = CsvUtils_1.CsvUtils.identifyCsvSepartor(
					csvContent.split('\n')[0],
					companyConfig.csvSeparator
				);
				const jsonFromFile = CsvUtils_1.CsvUtils.csv2json(csvContent, separator);
				const jsonParameterized = new Builder_1.Builder(jsonFromFile, companyConfig, media).build();
				const configVersion = companyConfig.version;
				const configTimestamp = DateUtils_1.DateUtils.newDateStringFormat(
					companyConfig.insertTime,
					'yyyymmddhhMMss',
					'hh:MM:ss dd/mm/yyyy'
				);
				return new Promise((resolve, reject) => {
					converter.json2csv(
						jsonParameterized,
						(err, csv) => {
							csv += '\n\nConfiguracao versao' + separator + configVersion;
							csv += '\nConfiguracao inserida em' + separator + configTimestamp;
							if (err) reject(err);
							resolve(csv);
						},
						{
							delimiter: {
								field: separator,
							},
						}
					);
				});
			})
			.then((csv) => {
				const fileDao = new FileDAO_1.FileDAO();
				fileDao.file = Buffer.from(csv, 'utf8');
				return fileDao.save(filePath.replace('.csv', '_parametrizado.csv')).then(() => {
					return csv;
				});
			})
			.then((csv) => {
				res.setHeader('Content-disposition', 'attachment; filename=data.csv');
				res.set('Content-Type', 'text/csv; charset=utf-8');
				apiResponse.responseText = csv;
				apiResponse.statusCode = 200;
				res.status(apiResponse.statusCode).send(apiResponse.responseText);
			})
			.catch((err) => {
				if (apiResponse.statusCode === 200) {
					apiResponse.statusCode = 500;
				}
				apiResponse.responseText = 'Falha ao salvar o arquivo!';
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				if (apiResponse.statusCode !== 200) {
					res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				}
			});
	});
};
exports.default = build;
