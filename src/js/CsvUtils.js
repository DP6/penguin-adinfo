'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CsvUtils = void 0;
const JsonUtils_1 = require('./JsonUtils');
class CsvUtils {
	/**
	 * Verifica se o CSV é vazio
	 * @param linesOfCsv Array com as linhas do csv
	 * @returns Booleano indicando se o conteúdo do csv é vazio ou não
	 *
	 * Retorna true caso todas as linhas sejam vazias ou contenham somente espaços em branco
	 */
	static isCsvEmpty(linesOfCsv) {
		return linesOfCsv.filter((line) => line.trim() !== '').length === 0;
	}
	/**
	 * Transformação CSV > JSON
	 * @param csvContent Conteúdo do CSV
	 * @param separator Caracter utilizado na separação de colunas do CSV
	 * @returns Objeto JSON correspondente ao CSV
	 *
	 * Função que converte uma string de um conteúdo CSV em um objeto JSON
	 */
	static csv2json(csvContent, separator) {
		const linesOfCsv = csvContent
			.split('\n')
			.filter((line) => line.trim() !== '');
		if (this.isCsvEmpty(linesOfCsv)) return [];
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
	/**
	 * Verifica se o veículo exista no Json de configurações
	 * @param config Json de configurações
	 * @param vehicle Veículo a ser buscado
	 * @returns Booelano indicando se o veículo foi configurado no Json de configurações
	 *
	 * Retorna true ou false informado se o veículo foi configurado
	 */
	static existsVehicleInConfig(config, vehicle) {
		return config[vehicle] === undefined ? false : true;
	}
	/**
	 * Transforma um objeto JSON da configuração de parametros da empresa em uma linha CSV
	 * @param jsonConfig Objeto JSON respectivo às configurações de parametrização da empresa
	 * @param separator Separador de colunas a ser utilizado no CSV
	 * @returns String correspondente ao CSV gerado
	 *
	 * Recebe o objeto JSON de configurações da empresa e gera uma string correspondente ao CSV, de acordo com o separado passado no parâmetro
	 */
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
