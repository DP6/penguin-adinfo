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
		const separators = {
			separator: this._companyConfig.separator,
			spaceSeparator: this._companyConfig.spaceSeparator,
		};
		const linesBuilded: { [key: string]: string }[] = linesWithContent.map(
			(lineFromFile) => {
				const parameters = new ParametrizerFactory(
					lineFromFile,
					this._companyConfig,
					separators
				).build(StringUtils.normalize(this._media)).buildedLine;
				return JsonUtils.addParametersAt(lineFromFile, parameters);
			}
		);
		return linesBuilded;
	}
}
