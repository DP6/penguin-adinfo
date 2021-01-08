'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ParametrizerFactory = void 0;
const Adobe_1 = require('./Adobe');
const FacebookAds_1 = require('./FacebookAds');
const GA_1 = require('./GA');
const GoogleAds_1 = require('./GoogleAds');
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
			case 'googleads':
				return new GoogleAds_1.GoogleAds(this._csvLines, this._config);
			case 'facebookads':
				return new FacebookAds_1.FacebookAds(
					this._csvLines,
					this._config
				);
		}
	}
}
exports.ParametrizerFactory = ParametrizerFactory;
