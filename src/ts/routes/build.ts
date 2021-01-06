import { ConfigDAO } from '../models/DAO/ConfigDAO';
import { FileDAO } from '../models/DAO/FileDAO';
import { Config } from '../models/Config';
import { DateUtils } from '../utils/DateUtils';
import { CsvUtils } from '../utils/CsvUtils';
import { Builder } from '../controllers/Builder';
import * as converter from 'json-2-csv';

const build = (app: { [key: string]: any }) => {
	app.post(
		'/build/:media',
		(req: { [key: string]: any }, res: { [key: string]: any }) => {
			const media = req.params.media;
			const company = req.body.company;
			const agency = req.body.agency;
			if (!company || !agency || !req.files.data) {
				res.status(500).send({ message: 'Parâmetros incorretos!' });
				return;
			}

			const fileContent = req.files.data.data;
			const filePath = `${agency}/${DateUtils.generateDateString()}.csv`;

			let companyConfig: Config;

			const configDAO = new ConfigDAO(company);
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
						const fileDAO = new FileDAO();
						fileDAO.file = fileContent;
						return fileDAO.save(filePath);
					} else {
						res.status(500).send(
							'Nenhuma configuração encontrada!'
						);
						return;
					}
				})
				.then(() => {
					const jsonFromFile = CsvUtils.csv2json(
						fileContent.toString(),
						companyConfig.csvSeparator
					);
					const jsonParameterized = new Builder(
						jsonFromFile,
						companyConfig,
						media
					).build();
					const configVersion = companyConfig.version;
					const configTimestamp = DateUtils.newDateStringFormat(
						companyConfig.insertTime,
						'yyyymmddhhMMss',
						'hh:MM:ss dd/mm/yyyy'
					);
					converter.json2csv(
						jsonParameterized,
						(err, csv) => {
							csv += '\n\nConfiguracao versao;' + configVersion;
							csv +=
								'\nConfiguracao inserida em;' + configTimestamp;
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
					console.log(err);
					console.log(err.message);
					res.status(500).send('Falha ao salvar arquivo!');
				});
		}
	);
};

export default build;
