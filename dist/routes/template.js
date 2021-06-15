'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const ConfigDAO_1 = require('../models/DAO/ConfigDAO');
const ApiResponse_1 = require('../models/ApiResponse');
const template = (app) => {
	app.get('/template', (req, res) => {
		const company = req.company;
		const configDAO = new ConfigDAO_1.ConfigDAO('company');
		const apiResponse = new ApiResponse_1.ApiResponse();
		configDAO
			.getLastConfig()
			.then((config) => {
				res.setHeader('Content-disposition', 'attachment; filename=template.csv');
				res.set('Content-Type', 'text/csv; charset=utf-8');
				apiResponse.statusCode = 200;
				apiResponse.responseText = config.toCsvTemplate();
			})
			.catch((err) => {
				apiResponse.responseText = 'Erro ao recuperar a configuração!';
				apiResponse.statusCode = 500;
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
};
exports.default = template;
