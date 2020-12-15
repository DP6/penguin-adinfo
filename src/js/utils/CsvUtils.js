"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvUtils = void 0;
const JsonUtils_1 = require("./JsonUtils");
class CsvUtils {
    static isCsvEmpty(linesOfCsv) {
        return linesOfCsv.filter((line) => line.trim() !== '').length === 0;
    }
    static csv2json(csvContent, separator) {
        const linesOfCsv = csvContent
            .split('\n')
            .filter((line) => line.trim() !== '');
        if (this.isCsvEmpty(linesOfCsv))
            return [];
        const headers = [];
        linesOfCsv[0].split(separator).map((header) => {
            headers.push(header.replace('\\r', '').trim());
        });
        headers[headers.length - 1] = headers[headers.length - 1];
        const jsonFromCsv = [];
        const body = linesOfCsv.slice(1);
        body.map((line) => {
            const lineInJson = {};
            line.split(separator).map((item, index) => {
                lineInJson[headers[index]] = item.replace('\r', '').trim();
            });
            jsonFromCsv.push(lineInJson);
        });
        return jsonFromCsv;
    }
    static existsVehicleInConfig(config, vehicle) {
        return config[vehicle] === undefined ? false : true;
    }
    static config2csvHeader(jsonConfig, separator) {
        const configValues = [];
        configValues.push('Url');
        const vehicle = JsonUtils_1.JsonUtils.normalizeKeys(jsonConfig)['ga']
            ? 'ga'
            : 'adobe';
        if (!this.existsVehicleInConfig(jsonConfig, vehicle))
            return configValues.join(separator);
        Object.keys(jsonConfig[vehicle]).map((campaignParam) => {
            Object.keys(jsonConfig[vehicle][campaignParam]).map((param) => {
                if (configValues.indexOf(param) === -1)
                    configValues.push(param);
            });
        });
        return configValues.join(separator);
    }
}
exports.CsvUtils = CsvUtils;
