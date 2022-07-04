"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigDAO_1 = require("../models/DAO/ConfigDAO");
const FileDAO_1 = require("../models/DAO/FileDAO");
const DateUtils_1 = require("../utils/DateUtils");
const CsvUtils_1 = require("../utils/CsvUtils");
const Builder_1 = require("../controllers/Builder");
const ApiResponse_1 = require("../models/ApiResponse");
const CampaignDAO_1 = require("../models/DAO/CampaignDAO");
const converter = require("json-2-csv");
const build = (app) => {
    app.post('/build/:analyticsTool/:media?', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const apiResponse = new ApiResponse_1.ApiResponse();
        if ((!req.files || !req.files.data) && !req.body.csv) {
            apiResponse.responseText = 'Nenhum arquivo foi enviado!';
            apiResponse.statusCode = 400;
            res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
            return;
        }
        else if (!campaign) {
            apiResponse.responseText = 'Nenhuma campanha foi informada!';
            apiResponse.statusCode = 400;
            res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
            return;
        }
        const adOpsTeamCampaigns = yield new CampaignDAO_1.CampaignDAO().getAllCampaignsFrom(adOpsTeamPath, permission);
        if (!adOpsTeamCampaigns) {
            apiResponse.responseText = 'Campanha não cadastrada na adOpsTeam!';
            apiResponse.statusCode = 400;
            res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
            return;
        }
        const adOpsTeamCampaignsNames = adOpsTeamCampaigns.map((campaign) => {
            return campaign.campaignName;
        });
        if (!adOpsTeamCampaignsNames.includes(campaign)) {
            apiResponse.responseText = 'Campanha não cadastrada na adOpsTeam!';
            apiResponse.statusCode = 400;
            res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
            return;
        }
        const fileDate = DateUtils_1.DateUtils.generateDateString();
        const fileContent = req.files ? req.files.data.data : req.body.csv;
        const filePath = `${advertiser}/${adOpsTeamPath}/${campaign}/${DateUtils_1.DateUtils.generateDateString()}.csv`;
        let advertiserConfig;
        const configDAO = new ConfigDAO_1.ConfigDAO(advertiser);
        configDAO
            .getLastConfig()
            .then((config) => {
            advertiserConfig = config;
            if (advertiserConfig) {
                const advertiserConfigJson = advertiserConfig.toJson();
                if (!advertiserConfigJson['analyticsTools'][analyticsTool]) {
                    apiResponse.statusCode = 400;
                    throw new Error(`Ferramenta de Analytics ${analyticsTool} não foi configurada!`);
                }
                else if (advertiserConfigJson['analyticsTools'] &&
                    !!media &&
                    !advertiserConfigJson['mediaTaxonomy'][media]) {
                    apiResponse.statusCode = 400;
                    throw new Error(`Mídia ${media} não foi configurada!`);
                }
                const fileDAO = new FileDAO_1.FileDAO();
                fileDAO.file = fileContent;
                return fileDAO.save(filePath);
            }
            else {
                apiResponse.statusCode = 500;
                throw new Error('Nenhuma configuração encontrada!');
            }
        })
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            let csvContent = fileContent;
            if (req.files) {
                csvContent = fileContent.toString();
            }
            const separator = CsvUtils_1.CsvUtils.identifyCsvSepartor(csvContent.split('\n')[0], advertiserConfig.csvSeparator);
            const jsonFromFile = CsvUtils_1.CsvUtils.csv2json(csvContent, separator);
            const headersFromInputJsonFile = Object.keys(jsonFromFile[0]);
            const jsonParameterized = new Builder_1.Builder(jsonFromFile, advertiserConfig, analyticsTool, media).build();
            const configVersion = advertiserConfig.version;
            const configTimestamp = DateUtils_1.DateUtils.newDateStringFormat(advertiserConfig.insertTime, 'yyyymmddhhMMss', 'hh:MM:ss dd/mm/yyyy');
            const csv = new Promise((resolve, reject) => {
                converter.json2csv(jsonParameterized, (err, csv) => __awaiter(void 0, void 0, void 0, function* () {
                    let parametrizedCsv = csv
                        .split('\n')
                        .map((csvLine) => csvLine.split(separator).slice(0, -1).join(separator))
                        .join('\n');
                    const fileDao = new FileDAO_1.FileDAO();
                    fileDao.file = Buffer.from(parametrizedCsv, 'utf8');
                    parametrizedCsv += '\n\nConfiguracao versao' + separator + configVersion;
                    parametrizedCsv += '\nConfiguracao inserida em' + separator + configTimestamp;
                    if (err) {
                        reject(err);
                        throw Error('Falha na geração do CSV!');
                    }
                    yield Promise.all([fileDao.save(filePath.replace('.csv', '_parametrizado.csv'))]);
                    resolve(parametrizedCsv);
                }), {
                    delimiter: {
                        field: separator,
                    },
                });
            });
            const [jsonHistContentBuff] = yield Promise.all([
                new FileDAO_1.FileDAO().getContentFrom(`${fullHistoricalFilePath}.json`),
            ]);
            let jsonHistContentString;
            let jsonHistContentJSONParse;
            if (!jsonHistContentBuff.toString()) {
                jsonHistContentJSONParse = {
                    campaign: campaign,
                    adOpsTeam: adOpsTeam,
                    [fileDate]: {},
                };
            }
            else {
                jsonHistContentString = jsonHistContentBuff.toString();
                jsonHistContentJSONParse = JSON.parse(jsonHistContentString);
                jsonHistContentJSONParse[fileDate] = {};
            }
            jsonHistContentJSONParse[fileDate]['metadata'] = {
                file_date: new Date().toISOString(),
                status: 'active',
                agency_status: 'active',
                author: userEmail,
            };
            jsonHistContentJSONParse[fileDate]['input'] = [];
            const linesParameterized = Object.values(jsonParameterized);
            linesParameterized.forEach((line) => {
                const lineKeys = Object.keys(line);
                const filteredObjects = lineKeys
                    .filter((key) => {
                    return headersFromInputJsonFile.includes(key);
                })
                    .reduce((object, key) => {
                    object[key] = line[key];
                    return object;
                }, {});
                jsonHistContentJSONParse[fileDate]['input'].push(filteredObjects);
            });
            jsonHistContentJSONParse[fileDate]['result'] = [];
            const jsonParameterizedTemp = Object.assign({}, jsonParameterized);
            Object.values(jsonParameterizedTemp).forEach((line) => {
                headersFromInputJsonFile.forEach((header) => {
                    delete line[header];
                });
            });
            jsonParameterized.forEach((line) => {
                const objToPush = Object.assign({}, line);
                objToPush['metadata'] = {
                    hasError: objToPush.hasError,
                };
                delete objToPush.hasError;
                jsonHistContentJSONParse[fileDate]['result'].push(objToPush);
            });
            const jsonHistDao = new FileDAO_1.FileDAO();
            jsonHistDao.file = Buffer.from(JSON.stringify(jsonHistContentJSONParse), 'utf8');
            yield Promise.all([jsonHistDao.save(`${fullHistoricalFilePath}.json`)]);
            return csv;
        }))
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
    }));
};
exports.default = build;
