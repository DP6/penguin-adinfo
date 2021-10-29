import { Config } from '../models/Config';
import { CsvUtils } from '../utils/CsvUtils';
import { JsonUtils } from '../utils/JsonUtils';
import { StringUtils } from '../utils/StringUtils';
import { ParametrizerFactory } from '../models/ParametrizerFactory';

export class Builder {
	private _jsonFromFile: { [key: string]: string }[];
	private _companyConfig: Config;
	private _media: string;
	private _analyticsTool: string;

	constructor(jsonFromFile: { [key: string]: string }[], companyConfig: Config, analyticsTool: string, media?: string) {
		this._jsonFromFile = jsonFromFile;
		this._companyConfig = companyConfig;
		this._media = media;
		this._analyticsTool = analyticsTool;
	}

	/**
	 * Parametriza o csv de acordo com a midia
	 */
	public build(): { [key: string]: any }[] {
		const linesWithContent = this._jsonFromFile.filter((line) => !CsvUtils.isLineEmpty(line));
		const linesBuilded: { [key: string]: string }[] = linesWithContent.map((lineFromFile) => {
			const parametrizerObject = new ParametrizerFactory(lineFromFile, this._companyConfig).build(this._analyticsTool);
			const parameters = parametrizerObject.buildedLine();
			if (this._media) {
				const mediaParameters = new ParametrizerFactory(lineFromFile, this._companyConfig)
					.build(StringUtils.normalize(this._media))
					.buildedLine();
				const allParameters = {
					...mediaParameters.values,
					...parameters.values,
					hasError: parameters.hasError || mediaParameters.hasError,
				};
				return JsonUtils.addParametersAt(lineFromFile, allParameters);
			} else {
				return JsonUtils.addParametersAt(lineFromFile, { ...parameters.values, hasError: parameters.hasError });
			}
		});
		return linesBuilded;
	}
}
