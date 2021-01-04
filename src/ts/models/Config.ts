export class Config {
	private _separator: string;
	private _spaceSeparator: string;
	private _insertTime: string;
	private _version: number;
	private _analyticsTool: { [key: string]: { [key: string]: string[] } };
	private _medias: { [key: string]: JSON };

	constructor(jsonConfig: { [key: string]: any }) {
		this._separator = jsonConfig.separator;
		delete jsonConfig.separator;
		this._spaceSeparator = jsonConfig.spaceSeparator;
		delete jsonConfig.spaceSeparator;
		this._insertTime = jsonConfig.insertTime;
		delete jsonConfig.insertTime;
		this._version = jsonConfig.version;
		delete jsonConfig.version;
		this._analyticsTool = jsonConfig.ga || jsonConfig.adobe;
		delete jsonConfig.ga;
		delete jsonConfig.adobe;
		this._medias = jsonConfig;
	}

	/**
	 * Checa se a configuração é válida
	 */
	public validateConfig(): boolean {
		return !(
			!this._separator ||
			!this._spaceSeparator ||
			!this._insertTime ||
			!this._version ||
			!this._analyticsTool
		);
	}

	public toString(): string {
		const jsonConfig: { [key: string]: any } = {};
		Object.keys(this).forEach((key: string, index: number) => {
			jsonConfig[key.replace('_', '')] = Object.values(this)[index];
		});
		return JSON.stringify(jsonConfig);
	}

	get separator(): string {
		return this._separator;
	}

	get spaceSeparator(): string {
		return this._spaceSeparator;
	}

	get insertTime(): string {
		return this._insertTime;
	}

	get version(): number {
		return this._version;
	}

	get analyticsTool(): { [key: string]: { [key: string]: string[] } } {
		return this._analyticsTool;
	}

	get medias(): { [key: string]: JSON } {
		return this._medias;
	}
}
