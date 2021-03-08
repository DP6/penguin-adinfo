export class DependencyConfig {
	private _columnReference: string;
	private _valuesReference: string[];
	private _hasMatch: boolean;
	private _columnDestiny: string;
	private _matches: string[];

	constructor(dependencyConfig: {
		columnReference: string;
		valuesReference: string[];
		hasMatch: boolean;
		columnDestiny: string;
		matches: string[];
	}) {
		const {
			columnReference,
			hasMatch,
			matches,
			valuesReference,
			columnDestiny,
		} = dependencyConfig;
		this._columnReference = columnReference;
		this._hasMatch = hasMatch;
		this._matches = matches;
		this._valuesReference = valuesReference;
		this._columnDestiny = columnDestiny;
	}

	/**
	 * Transforma a configuração em um objeto JSON
	 */
	public toJson(): {
		columnReference: string;
		valuesReference: string[];
		hasMatch: boolean;
		columnDestiny: string;
		matches: string[];
	} {
		return {
			columnReference: this._columnReference,
			valuesReference: this._valuesReference,
			hasMatch: this._hasMatch,
			columnDestiny: this._columnDestiny,
			matches: this._matches,
		};
	}

	get columnDestiny(): string {
		return this._columnDestiny;
	}

	get matches(): string[] {
		return this._matches;
	}

	get hasMatch(): boolean {
		return this._hasMatch;
	}

	get columnReference(): string {
		return this._columnReference;
	}

	get valuesReference(): string[] {
		return this._valuesReference;
	}
}
