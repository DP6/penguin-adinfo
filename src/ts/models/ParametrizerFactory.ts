import csv from '../routes/csv';
import { Adobe } from './Adobe';
import { FacebookAds } from './FacebookAds';
import { GA } from './GA';
import { GoogleAds } from './GoogleAds';
import { Parametrizer } from './Parametrizer';

export class ParametrizerFactory {
	private _csvLines: { [key: string]: string };
	private _config: { [key: string]: any };
	private _separators: { [key: string]: string };
	private _validationRules: { [key: string]: string[] };
	private _configTool: { [key: string]: string[] };

	constructor(...args: { [key: string]: any }[]) {
		this._csvLines = args[0];
		this._config = args[1];
		this._separators = args[2];
		this._validationRules = args[3];
		if (args.length === 5) {
			this._configTool = args[4];
		}
	}

	//TODO ajustar a passagem do Config
	/**
	 * Constrói um parametrizador da classe especificada
	 * @param type Tipo da classe a ser construida
	 */
	public build(type: string): Parametrizer {
		const validationRules: { [key: string]: string[] } = {};
		Object.keys(this._config.analyticsTool[type]).map((field) => {
			Object.keys(this._config.analyticsTool[type][field]).map((key) => {
				validationRules[key] = this._config.analyticsTool[type][field][
					key
				];
			});
		});
		const config: { [key: string]: string[] } = {};
		Object.keys(this._config.analyticsTool[type]).map((param) => {
			config[param] = Object.keys(
				this._config.analyticsTool[type][param]
			);
		});
		switch (type) {
			case 'ga':
				return new GA(
					this._csvLines,
					config,
					this._separators,
					validationRules
				);
			case 'adobe':
				return new Adobe(
					this._csvLines,
					config,
					this._separators,
					validationRules
				);
			// case 'googleads':
			//     return new GoogleAds(this._csvLines, config, this._separators, validationRules, this._configTool);
			// case 'facebookads':
			//     return new FacebookAds(this._csvLines, config, this._separators, validationRules, this._configTool);
		}
	}
}
