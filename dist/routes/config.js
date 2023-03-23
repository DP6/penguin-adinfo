'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const ConfigDAO_1 = require('../models/DAO/ConfigDAO');
const Config_1 = require('../models/Config');
const ApiResponse_1 = require('../models/ApiResponse');
const config = (app) => {
	app.post('/config', (req, res) => {
		const advertiser = req.advertiser;
		const configString = req.body.config;
		const apiResponse = new ApiResponse_1.ApiResponse();
		if (!configString) {
			apiResponse.responseText = 'Configuração não foi informada!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		}
		const config = new Config_1.Config(JSON.parse(configString));
		const configDAO = new ConfigDAO_1.ConfigDAO(advertiser);
		const validateArray = (array) => {
			for (let i = 0; i < array.length; i++) {
				for (let j = 0; j < array.length; j++) {
					if (array[i] === array[j] && i != j) {
						apiResponse.statusCode = 500;
						apiResponse.responseText = 'Erro ao criar a configuração! Configuração com valores repetidos!';
						apiResponse.errorMessage = 'Erro ao criar a configuração! Configuração com valores repetidos!';
						res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
						return;
					}
				}
			}
		};
		const percorreObjeto = (objetos) => {
			for (const propriedade in objetos) {
				if (Array.isArray(objetos[propriedade])) {
					console.log(validateArray(objetos[propriedade]), objetos[propriedade]);
				} else if (typeof objetos[propriedade] == 'object') {
					percorreObjeto(objetos[propriedade]);
				}
			}
		};
		percorreObjeto(JSON.parse(configString));
		configDAO
			.addConfig(config)
			.then(() => {
				apiResponse.responseText = 'Configuração criada com sucesso!';
				apiResponse.statusCode = 200;
			})
			.catch((err) => {
				apiResponse.responseText = 'Erro ao criar a configuração!';
				apiResponse.statusCode = 500;
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
	app.get('/config', (req, res) => {
		const advertiser = req.advertiser;
		const configDAO = new ConfigDAO_1.ConfigDAO(advertiser);
		const apiResponse = new ApiResponse_1.ApiResponse();
		configDAO
			.getLastConfig()
			.then((config) => {
				apiResponse.responseText = config.toString();
				apiResponse.statusCode = 200;
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = 'Erro ao recuperar configuração!';
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
};
exports.default = config;
