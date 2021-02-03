'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const ConfigDAO_1 = require('../models/DAO/ConfigDAO');
const Config_1 = require('../models/Config');
const config = (app) => {
	app.post('/config', (req, res) => {
		const company = req.company;
		const configString = req.body.config;
		if (!configString) {
			res.status(400).send('Configuração não foi informada!');
			return;
		}
		const config = new Config_1.Config(JSON.parse(configString));
		const configDAO = new ConfigDAO_1.ConfigDAO(company);
		configDAO
			.addConfig(config)
			.then((data) => {
				res.status(200).send('Configuração criada com sucesso!');
			})
			.catch((err) => {
				res.status(500).send('Erro ao criar a configuração!');
			});
	});
	app.get('/config', (req, res) => {
		const company = req.company;
		const configDAO = new ConfigDAO_1.ConfigDAO(company);
		configDAO
			.getLastConfig()
			.then((config) => {
				if (config) {
					res.status(200).send(config.toString());
				} else {
					res.status(200).send('{}');
				}
			})
			.catch((err) => {
				res.status(500).send('Erro ao recuperar configuração!');
			});
	});
};
exports.default = config;
