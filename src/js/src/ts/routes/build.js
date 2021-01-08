'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const ConfigDAO_1 = require('../models/DAO/ConfigDAO');
const FileDAO_1 = require('../models/DAO/FileDAO');
const DateUtils_1 = require('../utils/DateUtils');
const CsvUtils_1 = require('../utils/CsvUtils');
const Builder_1 = require('../controllers/Builder');
const converter = require('json-2-csv');
const build = (app) => {
	app.post('/build/:media', (req, res) => {
		const media = req.params.media;
		const company = req.body.company;
		const agency = req.body.agency;
		if (!company || !agency || !req.files.data) {
			res.status(500).send({ message: 'Parâmetros incorretos!' });
			return;
		}
		const fileContent = req.files.data.data;
		const filePath = `${agency}/${DateUtils_1.DateUtils.generateDateString()}.csv`;
		let companyConfig;
		const configDAO = new ConfigDAO_1.ConfigDAO(company);
		configDAO
			.getLastConfig()
			.then((config) => {
				if (config) {
					companyConfig = config;
					if (!companyConfig.toJson()[media]) {
						res.status(500).send({
							message: `Mídia ${media} não configurada!`,
						});
						return;
					}
					const fileDAO = new FileDAO_1.FileDAO();
					fileDAO.file = fileContent;
					return fileDAO.save(filePath);
				} else {
					res.status(500).send('Nenhuma configuração encontrada!');
					return;
				}
			})
			.then(() => {
				const jsonFromFile = CsvUtils_1.CsvUtils.csv2json(
					fileContent.toString(),
					companyConfig.csvSeparator
				);
				const jsonParameterized = new Builder_1.Builder(
					jsonFromFile,
					companyConfig,
					media
				).build();
				const configVersion = companyConfig.version;
				const configTimestamp = DateUtils_1.DateUtils.newDateStringFormat(
					companyConfig.insertTime,
					'yyyymmddhhMMss',
					'hh:MM:ss dd/mm/yyyy'
				);
				converter.json2csv(
					jsonParameterized,
					(err, csv) => {
						csv += '\n\nConfiguracao versao;' + configVersion;
						csv += '\nConfiguracao inserida em;' + configTimestamp;
						res.setHeader(
							'Content-disposition',
							'attachment; filename=data.csv'
						);
						res.set('Content-Type', 'text/csv; charset=utf-8');
						res.status(200).send(csv);
					},
					{
						delimiter: {
							field: companyConfig.csvSeparator,
						},
					}
				);
			})
			.catch((err) => {
				res.status(500).send('Falha ao salvar arquivo!');
			});
	});
};
exports.default = build;
