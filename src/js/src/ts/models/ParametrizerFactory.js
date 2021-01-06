'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ParametrizerFactory = void 0;
const Adobe_1 = require('./Adobe');
const GA_1 = require('./GA');
class ParametrizerFactory {
	constructor(csvLines, config) {
		this._csvLines = csvLines;
		this._config = config;
	}
	build(type) {
		switch (type) {
			case 'ga':
				return new GA_1.GA(this._csvLines, this._config);
			case 'adobe':
				return new Adobe_1.Adobe(this._csvLines, this._config);
		}
	}
}
exports.ParametrizerFactory = ParametrizerFactory;
