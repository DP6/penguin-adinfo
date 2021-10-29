'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Builder = void 0;
const CsvUtils_1 = require('../utils/CsvUtils');
const JsonUtils_1 = require('../utils/JsonUtils');
const StringUtils_1 = require('../utils/StringUtils');
const ParametrizerFactory_1 = require('../models/ParametrizerFactory');
class Builder {
	constructor(jsonFromFile, companyConfig, analyticsTool, media) {
		this._jsonFromFile = jsonFromFile;
		this._companyConfig = companyConfig;
		this._media = media;
		this._analyticsTool = analyticsTool;
	}
	build() {
		const linesWithContent = this._jsonFromFile.filter((line) => !CsvUtils_1.CsvUtils.isLineEmpty(line));
		const linesBuilded = linesWithContent.map((lineFromFile) => {
			const parametrizerObject = new ParametrizerFactory_1.ParametrizerFactory(lineFromFile, this._companyConfig).build(
				this._analyticsTool
			);
			const parameters = parametrizerObject.buildedLine();
			if (this._media) {
				const mediaParameters = new ParametrizerFactory_1.ParametrizerFactory(lineFromFile, this._companyConfig)
					.build(StringUtils_1.StringUtils.normalize(this._media))
					.buildedLine();
				const allParameters = Object.assign(
					Object.assign(Object.assign({}, mediaParameters.values), parameters.values),
					{ hasError: parameters.hasError || mediaParameters.hasError }
				);
				return JsonUtils_1.JsonUtils.addParametersAt(lineFromFile, allParameters);
			} else {
				return JsonUtils_1.JsonUtils.addParametersAt(
					lineFromFile,
					Object.assign(Object.assign({}, parameters.values), { hasError: parameters.hasError })
				);
			}
		});
		return linesBuilded;
	}
}
exports.Builder = Builder;
