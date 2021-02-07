import { Config } from '../models/Config';
import { CsvUtils } from '../utils/CsvUtils';
import { JsonUtils } from '../utils/JsonUtils';
import { StringUtils } from '../utils/StringUtils';
import { ParametrizerFactory } from '../models/ParametrizerFactory';

export class Builder {
	private _jsonFromFile: { [key: string]: string }[];
	private _companyConfig: Config;
	private _media: string;

	constructor(
		jsonFromFile: { [key: string]: string }[],
		companyConfig: Config,
		media: string
	) {
		this._jsonFromFile = jsonFromFile;
		this._companyConfig = companyConfig;
		this._media = media;
	}

	/**
	 * Parametriza o csv de acordo com a midia
	 */
	public build(): { [key: string]: string }[] {
		const linesWithContent = this._jsonFromFile.filter(
			(line) => !CsvUtils.isLineEmpty(line)
		);
		const linesBuilded: { [key: string]: string }[] = linesWithContent.map(
			(lineFromFile) => {
				const parametrizerObject = new ParametrizerFactory(
					lineFromFile,
					this._companyConfig
				).build(StringUtils.normalize(this._media));
				const parameters = parametrizerObject.buildedLine();
				if (
					Object.getPrototypeOf(parametrizerObject.constructor)
						.name === 'Vehicle'
				) {
					const analyticsToolParameters = new ParametrizerFactory(
						lineFromFile,
						this._companyConfig
					)
						.build(
							StringUtils.normalize(
								this._companyConfig.analyticsToolName
							)
						)
						.buildedLine();
					return JsonUtils.addParametersAt(
						lineFromFile,
						parameters,
						analyticsToolParameters
					);
				} else {
					return JsonUtils.addParametersAt(lineFromFile, parameters);
				}
			}
		);
		return linesBuilded;
	}
}
