import { Config } from '../models/Config';
import { CsvUtils } from '../utils/CsvUtils';
import { JsonUtils } from '../utils/JsonUtils';
import { StringUtils } from '../utils/StringUtils';
import { ParametrizerFactory } from '../models/ParametrizerFactory';

export class Builder {
	private _jsonFromFile: { [key: string]: string }[];
	private _advertiserConfig: Config;
	private _media: string;
	private _analyticsTool: string;

	constructor(
		jsonFromFile: { [key: string]: string }[],
		advertiserConfig: Config,
		analyticsTool: string,
		media?: string
	) {
		this._jsonFromFile = jsonFromFile;
		this._advertiserConfig = advertiserConfig;
		this._media = media;
		this._analyticsTool = analyticsTool;
	}

	/**
	 * Parametriza o csv de acordo com a midia
	 */
	public build(): { [key: string]: any }[] {
		const linesWithContent = this._jsonFromFile.filter((line) => !CsvUtils.isLineEmpty(line));
		const linesBuilded: { [key: string]: string }[] = linesWithContent.map((lineFromFile) => {
			const parametrizerObject = new ParametrizerFactory(lineFromFile, this._advertiserConfig).build(
				this._analyticsTool
			);
			const parameters = parametrizerObject.buildedLine();
			// console.log('parameters no build():', parameters)
			if (this._media) {
				const mediaParameters = new ParametrizerFactory(lineFromFile, this._advertiserConfig)
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
		// console.log('linesbuilded:', linesBuilded)
		return linesBuilded;
	}
}
