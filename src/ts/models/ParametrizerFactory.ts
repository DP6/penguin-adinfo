import { Adobe } from './Adobe';
import { FacebookAds } from './FacebookAds';
import { GA } from './GA';
import { GoogleAds } from './GoogleAds';
import { Parametrizer } from './Parametrizer';
import { Config } from './Config';
import { GeneralVehicle } from './GeneralVehicle';

export class ParametrizerFactory {
	private _csvLines: { [key: string]: string };
	private _config: Config;

	constructor(csvLines: { [key: string]: string }, config: Config) {
		this._csvLines = csvLines;
		this._config = config;
	}

	/**
	 * Constrói um parametrizador da classe especificada
	 * @param type Tipo da classe a ser construida
	 */
	public build(type: string): Parametrizer {
		switch (type) {
			case 'ga':
				return new GA(this._csvLines, this._config);
			case 'adobe':
				return new Adobe(this._csvLines, this._config);
			default:
				return new GeneralVehicle(this._csvLines, this._config, type);
		}
	}
}
