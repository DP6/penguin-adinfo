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
		const userEmail = req.email;

		const pathDefault = `${advertiser}/${adOpsTeamPath}/${campaign}`;

		const fullHistoricalFilePath = `${pathDefault}/historical`;

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

		const fileDate = DateUtils.generateDateString();

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
				const headersFromInputJsonFile = Object.keys(jsonFromFile[0]);
				const jsonParameterized = new Builder(jsonFromFile, advertiserConfig, analyticsTool, media).build();
				const configVersion = advertiserConfig.version;
				const configTimestamp = DateUtils.newDateStringFormat(
					advertiserConfig.insertTime,
					'yyyymmddhhMMss',
					'hh:MM:ss dd/mm/yyyy'
				);

				const csv = new Promise((resolve, reject) => {
					converter.json2csv(
						jsonParameterized,
						async (err, csv) => {
							let parametrizedCsv = csv
								.split('\n')
								.map((csvLine) => csvLine.split(separator).slice(0, -1).join(separator))
								.join('\n');

							const fileDao = new FileDAO();
							fileDao.file = Buffer.from(parametrizedCsv, 'utf8');

							parametrizedCsv += '\n\nConfiguracao versao' + separator + configVersion;
							parametrizedCsv += '\nConfiguracao inserida em' + separator + configTimestamp;

							if (err) reject(err);

							await Promise.all([fileDao.save(filePath.replace('.csv', '_parametrizado.csv'))]);
							resolve(parametrizedCsv);
						},
						{
							delimiter: {
								field: separator,
							},
						}
					);
				});

				if (csv) {
					const [jsonHistContentBuff] = await Promise.all([
						await await new FileDAO().getContentFrom(`${fullHistoricalFilePath}.json`),
					]);
					let jsonHistContentString;
					let jsonHistContentJSONParse: any;
					if (!jsonHistContentBuff.toString()) {
						jsonHistContentJSONParse = {
							campaign: campaign,
							adOpsTeam: adOpsTeam,
							[fileDate]: {}, //insertion date
						};
					} else {
						jsonHistContentString = jsonHistContentBuff.toString();
						jsonHistContentJSONParse = JSON.parse(jsonHistContentString);
						jsonHistContentJSONParse[fileDate] = {};
					}

					//Filling in parametrization metadata
					jsonHistContentJSONParse[fileDate]['metadata'] = {
						file_date: new Date().toISOString(),
						status: 'active', //
						agency_status: 'active', //upgrade to get from adOpsTeam instance
						author: userEmail,
					};

					//Filling in input key from parametrization
					jsonHistContentJSONParse[fileDate]['input'] = [];

					const linesParameterized = Object.values(jsonParameterized);

					linesParameterized.forEach((line) => {
						const lineKeys = Object.keys(line);
						const filteredObjects = lineKeys
							.filter((key) => {
								return headersFromInputJsonFile.includes(key);
							})
							.reduce((object: any, key: any) => {
								object[key] = line[key];
								return object;
							}, {});

						jsonHistContentJSONParse[fileDate]['input'].push(filteredObjects);
					});

					//Filling in result key from parametrization
					jsonHistContentJSONParse[fileDate]['result'] = [];
					const jsonParameterizedTemp = { ...jsonParameterized };

					Object.values(jsonParameterizedTemp).forEach((line: any) => {
						headersFromInputJsonFile.forEach((header: any) => {
							delete line[header];
						});
					});

					jsonParameterized.forEach((line) => {
						const objToPush = { ...line };

						objToPush['metadata'] = {
							hasError: objToPush.hasError,
						};
						delete objToPush.hasError;

						jsonHistContentJSONParse[fileDate]['result'].push(objToPush);
					});

					const jsonHistDao = new FileDAO();
					jsonHistDao.file = Buffer.from(JSON.stringify(jsonHistContentJSONParse), 'utf8');

					await Promise.all([jsonHistDao.save(`${fullHistoricalFilePath}.json`)]);
				} else {
					throw Error('Falha na geração do CSV!');
				}

				return csv;
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
