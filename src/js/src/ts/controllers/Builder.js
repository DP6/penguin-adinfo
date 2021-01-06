'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Builder = void 0;
const CsvUtils_1 = require('../utils/CsvUtils');
const JsonUtils_1 = require('../utils/JsonUtils');
const StringUtils_1 = require('../utils/StringUtils');
const ParametrizerFactory_1 = require('../models/ParametrizerFactory');
class Builder {
	constructor(jsonFromFile, companyConfig, media) {
		this._jsonFromFile = jsonFromFile;
		this._companyConfig = companyConfig;
		this._media = media;
	}
	build() {
		const linesWithContent = this._jsonFromFile.filter(
			(line) => !CsvUtils_1.CsvUtils.isLineEmpty(line)
		);
		const separators = {
			separator: this._companyConfig.separator,
			spaceSeparator: this._companyConfig.spaceSeparator,
		};
		const linesBuilded = linesWithContent.map((lineFromFile) => {
			const parameters = new ParametrizerFactory_1.ParametrizerFactory(
				lineFromFile,
				this._companyConfig,
				separators
			).build(StringUtils_1.StringUtils.normalize(this._media))
				.buildedLine;
			return JsonUtils_1.JsonUtils.addParametersAt(
				lineFromFile,
				parameters
			);
		});
		return linesBuilded;
	}
}
exports.Builder = Builder;
