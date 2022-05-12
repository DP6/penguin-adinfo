import { ConfigDAO } from '../models/DAO/ConfigDAO';
import { FileDAO } from '../models/DAO/FileDAO';
import { Config } from '../models/Config';
import { DateUtils } from '../utils/DateUtils';
import { CsvUtils } from '../utils/CsvUtils';
import { Builder } from '../controllers/Builder';
import { ApiResponse } from '../models/ApiResponse';
import { CampaignDAO } from '../models/DAO/CampaignDAO';
import * as converter from 'json-2-csv';

const build = (app: { [key: string]: any }): void => {
	app.post('/build/:analyticsTool/:media?', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const analyticsTool = req.params.analyticsTool;
		const media = req.params.media;
		const advertiser = req.advertiser;
		const adOpsTeam = req.headers.adopsteam;
		const adOpsTeamPath = adOpsTeam ? adOpsTeam : 'AdvertiserCampaigns';
		const campaign = req.headers.campaign;
		const permission = req.permission;

		const pathDefault = `${advertiser}/${adOpsTeamPath}/${campaign}`;

		const fullHistoricalFilePath = `${pathDefault}/historical`;
		const correctHistoricalFilePath = `${pathDefault}/correctHistorical`;

		const apiResponse = new ApiResponse();

		if ((!req.files || !req.files.data) && !req.body.csv) {
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

		const adOpsTeamCampaigns = await new CampaignDAO().getAllCampaignsFrom(adOpsTeamPath, permission);

		if (!adOpsTeamCampaigns) {
			apiResponse.responseText = 'Campanha não cadastrada na adOpsTeam!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		}

		const adOpsTeamCampaignsNames = adOpsTeamCampaigns.map((campaign: { campaignName: string; campaignId: string }) => {
			return campaign.campaignName;
		});

		if (!adOpsTeamCampaignsNames.includes(campaign)) {
			apiResponse.responseText = 'Campanha não cadastrada na adOpsTeam!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		}

		const fileName = DateUtils.generateDateString();

		const fileContent = req.files ? req.files.data : req.body.csv;

		const filePath = `${advertiser}/${adOpsTeamPath}/${campaign}/${DateUtils.generateDateString()}.csv`;

		let advertiserConfig: Config;

		const configDAO = new ConfigDAO(advertiser);
		configDAO
			.getLastConfig()
			.then((config: Config) => {
				advertiserConfig = config;
				if (advertiserConfig) {
					const advertiserConfigJson = advertiserConfig.toJson();
					if (!advertiserConfigJson['analyticsTools'][analyticsTool]) {
						apiResponse.statusCode = 400;
						throw new Error(`Ferramenta de Analytics ${analyticsTool} não foi configurada!`);
					} else if (
						advertiserConfigJson['analyticsTools'] &&
						!!media &&
						!advertiserConfigJson['mediaTaxonomy'][media]
					) {
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
			.then(async () => {
				let csvContent = fileContent;
				if (req.files) {
					csvContent = fileContent.toString();
				}
				const separator = CsvUtils.identifyCsvSepartor(csvContent.split('\n')[0], advertiserConfig.csvSeparator);
				const jsonFromFile = CsvUtils.csv2json(csvContent, separator);
				const jsonParameterized = new Builder(jsonFromFile, advertiserConfig, analyticsTool, media).build();
				const configVersion = advertiserConfig.version;
				const configTimestamp = DateUtils.newDateStringFormat(
					advertiserConfig.insertTime,
					'yyyymmddhhMMss',
					'hh:MM:ss dd/mm/yyyy'
				);

				let [fullHistoricalContent, correctHistoricalContent] = await Promise.all([
					(await new FileDAO().getContentFrom(`${fullHistoricalFilePath}_${advertiserConfig.version}.csv`)).toString(),
					(
						await new FileDAO().getContentFrom(`${correctHistoricalFilePath}_${advertiserConfig.version}.csv`)
					).toString(),
				]);

				return new Promise((resolve, reject) => {
					converter.json2csv(
						jsonParameterized,
						async (err, csv) => {
							const csvHeader = csv.split('\n')[0].split(separator).slice(0, -1).join(separator);
							const csvArrayContent = csv.split('\n').slice(1);

							const linesCorrectToSaveIntoCsv = csvArrayContent
								.filter((csvLine) => {
									const csvLineArray = csvLine.split(separator);
									return csvLineArray[csvLineArray.length - 1] === 'false';
								})
								.map((csvLine) => csvLine.split(separator).slice(0, -1).join(separator));

							const linesToSaveIntoCsv = csvArrayContent.map((csvLine) =>
								csvLine.split(separator).slice(0, -1).join(separator)
							);

							if (fullHistoricalContent) {
								fullHistoricalContent +=
									'\n' +
									linesToSaveIntoCsv.map((csvLine: string) => `${fileName}.csv${separator}${csvLine}`).join('\n');
							} else {
								const csvArrayHeaderNewField = 'Arquivo' + separator + csvHeader;
								const csvContentNewField = linesToSaveIntoCsv.map(
									(csvLine: string) => `${fileName}.csv${separator}${csvLine}`
								);
								fullHistoricalContent = csvArrayHeaderNewField;
								if (csvContentNewField.length > 0) {
									fullHistoricalContent += '\n' + csvContentNewField.join('\n');
								}
							}

							const fullHistoricalFileDao = new FileDAO();
							fullHistoricalFileDao.file = Buffer.from(fullHistoricalContent, 'utf8');

							if (correctHistoricalContent) {
								correctHistoricalContent +=
									'\n' +
									linesCorrectToSaveIntoCsv
										.map((csvLine: string) => `${fileName}.csv${separator}${csvLine}`)
										.join('\n');
							} else {
								const csvArrayHeaderNewField = 'Arquivo' + separator + csvHeader;
								const csvContentNewField = linesCorrectToSaveIntoCsv.map(
									(csvLine: string) => `${fileName}.csv${separator}${csvLine}`
								);
								correctHistoricalContent = csvArrayHeaderNewField;
								if (csvContentNewField.length > 0) {
									correctHistoricalContent += '\n' + csvContentNewField.join('\n');
								}
							}

							const correctHistoricalFileDao = new FileDAO();
							correctHistoricalFileDao.file = Buffer.from(correctHistoricalContent, 'utf8');

							let parametrizedCsv = csv
								.split('\n')
								.map((csvLine) => csvLine.split(separator).slice(0, -1).join(separator))
								.join('\n');

							const fileDao = new FileDAO();
							fileDao.file = Buffer.from(parametrizedCsv, 'utf8');

							parametrizedCsv += '\n\nConfiguracao versao' + separator + configVersion;
							parametrizedCsv += '\nConfiguracao inserida em' + separator + configTimestamp;

							if (err) reject(err);
							await Promise.all([
								fullHistoricalFileDao.save(`${fullHistoricalFilePath}_${advertiserConfig.version}.csv`),
								correctHistoricalFileDao.save(`${correctHistoricalFilePath}_${advertiserConfig.version}.csv`),
								fileDao.save(filePath.replace('.csv', '_parametrizado.csv')),
							]);
							resolve(parametrizedCsv);
						},
						{
							delimiter: {
								field: separator,
							},
						}
					);
				});
			})
			.then((csv: string) => {
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

export default build;
