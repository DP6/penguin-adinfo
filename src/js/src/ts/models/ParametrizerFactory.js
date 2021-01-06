'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ParametrizerFactory = void 0;
const Adobe_1 = require('./Adobe');
const GA_1 = require('./GA');
class ParametrizerFactory {
	constructor(...args) {
		this._csvLines = args[0];
		this._config = args[1];
		this._separators = args[2];
		this._validationRules = args[3];
		if (args.length === 5) {
			this._configTool = args[4];
		}
	}
	build(type) {
		const validationRules = {};
		Object.keys(this._config.analyticsTool[type]).map((field) => {
			Object.keys(this._config.analyticsTool[type][field]).map((key) => {
				validationRules[key] = this._config.analyticsTool[type][field][
					key
				];
			});
		});
		const config = {};
		Object.keys(this._config.analyticsTool[type]).map((param) => {
			config[param] = Object.keys(
				this._config.analyticsTool[type][param]
			);
		});
		switch (type) {
			case 'ga':
				return new GA_1.GA(
					this._csvLines,
					config,
					this._separators,
					validationRules
				);
			case 'adobe':
				return new Adobe_1.Adobe(
					this._csvLines,
					config,
					this._separators,
					validationRules
				);
		}
	}
}
exports.ParametrizerFactory = ParametrizerFactory;
