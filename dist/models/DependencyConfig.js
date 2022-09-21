'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.DependencyConfig = void 0;
class DependencyConfig {
	constructor(dependencyConfig) {
		const { columnReference, hasMatch, matches, valuesReference, columnDestiny } = dependencyConfig;
		this._columnReference = columnReference;
		this._hasMatch = hasMatch;
		this._matches = matches;
		this._valuesReference = valuesReference;
		this._columnDestiny = columnDestiny;
	}
	toJson() {
		return {
			columnReference: this._columnReference,
			valuesReference: this._valuesReference,
			hasMatch: this._hasMatch,
			columnDestiny: this._columnDestiny,
			matches: this._matches,
		};
	}
	get columnDestiny() {
		return this._columnDestiny;
	}
	get matches() {
		return this._matches;
	}
	get hasMatch() {
		return this._hasMatch;
	}
	get columnReference() {
		return this._columnReference;
	}
	get valuesReference() {
		return this._valuesReference;
	}
}
exports.DependencyConfig = DependencyConfig;
