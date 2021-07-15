import { ConfigDAO } from '../models/DAO/ConfigDAO';
import { FileDAO } from '../models/DAO/FileDAO';
import { Config } from '../models/Config';
import { DateUtils } from '../utils/DateUtils';
import { CsvUtils } from '../utils/CsvUtils';
import { Builder } from '../controllers/Builder';
import { ApiResponse } from '../models/ApiResponse';
import * as converter from 'json-2-csv';

const build = (app: { [key: string]: any }): void => {
	app.post('/build/:media', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const media = req.params.media;
		const company = req.company;
		const agency = req.agency;
		const campaign = req.headers.campaign;

		const apiResponse = new ApiResponse();

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
			? `${company}/${agency}/${campaign}/${DateUtils.generateDateString()}.csv`
			: `${company}/${campaign}/${DateUtils.generateDateString()}.csv`;

		let companyConfig: Config;

		const configDAO = new ConfigDAO(company);
		configDAO
			.getLastConfig()
			.then((config: Config) => {
				companyConfig = config;
				if (companyConfig) {
					if (!companyConfig.toJson()[media]) {
						apiResponse.statusCode = 400;
						throw new Error(`Mídia ${media} não foi configurada!`);
					}
					const fileDAO = new FileDAO();
					fileDAO.file = fileContent;
					return fileDAO.save(filePath);
				} else {
					apiResponse.statusCode = 500;
					throw new Error('Nenhuma configuração encontrada!');
				}
			})
			.then(() => {
				const csvContent = fileContent.toString();
				const separator = CsvUtils.identifyCsvSepartor(csvContent.split('\n')[0], companyConfig.csvSeparator);
				const jsonFromFile = CsvUtils.csv2json(csvContent, separator);
				const jsonParameterized = new Builder(jsonFromFile, companyConfig, media).build();
				const configVersion = companyConfig.version;
				const configTimestamp = DateUtils.newDateStringFormat(
					companyConfig.insertTime,
					'yyyymmddhhMMss',
					'hh:MM:ss dd/mm/yyyy'
				);
				converter.json2csv(
					jsonParameterized,
					(err, csv) => {
						csv += '\n\nConfiguracao versao' + separator + configVersion;
						csv += '\nConfiguracao inserida em' + separator + configTimestamp;
						saveParameterizedFile(csv, filePath).then(() => {
							res.setHeader('Content-disposition', 'attachment; filename=data.csv');
							res.set('Content-Type', 'text/csv; charset=utf-8');
							apiResponse.responseText = csv;
							apiResponse.statusCode = 200;
							res.status(apiResponse.statusCode).send(apiResponse.responseText);
						});
					},
					{
						delimiter: {
							field: separator,
						},
					}
				);
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

/**
 * Salva o output da parametrização no Storage. O caminho da pasta é a mesma onde é salvo o input, porém apenas com o sufixo "_parametrizado"
 * @param csv Conteudo do csv
 * @param inputFilePath Caminho do arquivo csv de input
 */
const saveParameterizedFile = (csv: string, inputFilePath: string): Promise<void> => {
	const fileDao = new FileDAO();
	fileDao.file = Buffer.from(csv, 'utf8');
	return fileDao.save(inputFilePath.replace('.csv', '_parametrizado.csv'));
};

export default build;
