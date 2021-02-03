'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const ConfigDAO_1 = require('../models/DAO/ConfigDAO');
const template = (app) => {
	app.get('/template', (req, res) => {
		const company = req.company;
		const configDAO = new ConfigDAO_1.ConfigDAO(company);
		configDAO
			.getLastConfig()
			.then((config) => {
				res.setHeader(
					'Content-disposition',
					'attachment; filename=template.csv'
				);
				res.set('Content-Type', 'text/csv; charset=utf-8');
				if (config) {
					res.status(200).send(config.toCsvTemplate());
				} else {
					res.status(200).send('{}');
				}
			})
			.catch((err) => {
				res.status(500).send('Erro ao recuperar configuração!');
			});
	});
};
exports.default = template;
