"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvUtils = void 0;
class CsvUtils {
    static isCsvEmpty(linesOfCsv) {
        return linesOfCsv.filter((line) => line.trim() !== '').length === 0;
    }
    static isLineEmpty(lineOfCsv) {
        return Object.keys(lineOfCsv).filter((column) => lineOfCsv[column].trim() !== '').length === 0;
    }
    static csv2json(csvContent, separator) {
        const linesOfCsv = csvContent.split('\n').filter((line) => line.trim() !== '');
        if (this.isCsvEmpty(linesOfCsv))
            return [];
        const headers = [];
        linesOfCsv[0].split(separator).map((header) => {
            headers.push(header.replace('\\r', '').trim());
        });
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
    static identifyCsvSepartor(csvHeader, csvSeparatorDefault) {
        if (csvSeparatorDefault) {
            const separadoresEncontrados = csvSeparatorDefault.filter((separador) => csvHeader.includes(separador));
            return separadoresEncontrados.length > 0 ? separadoresEncontrados[0] : ',';
        }
        else {
            return csvHeader.includes(',') ? ',' : ';';
        }
    }
}
exports.CsvUtils = CsvUtils;
