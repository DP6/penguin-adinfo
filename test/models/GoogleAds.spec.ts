import { expect } from 'chai';
import { GoogleAds } from '../../src/ts/models/GoogleAds';
import { Config } from '../../src/ts/models/Config';

describe('GoogleAds', () => {
	describe('Valida a geração da linha do GoogleAds para GA', () => {
		it('Validar a geração de uma linha para o GA com todos Parâmetros corretos', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Produto: 'fifinha',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Dispositivo: ['desktop e mobile'],
					Produto: ['/.*/'],
				},
				ga: {
					utm_source: ['Tipo de Compra', 'Dispositivo'],
					utm_campaign: ['Produto'],
				},
				googleads: {
					campanha: ['Tipo de Compra', 'Dispositivo'],
					ad: ['Produto'],
				},
			});
			const googleAds = new GoogleAds(csvLine, config);
			let googleAdsFields = {
				campanha: 'cpc:desktop_e_mobile',
				ad: 'fifinha',
			};
			expect(JSON.stringify(googleAds.buildedLine())).to.equal(
				JSON.stringify(googleAdsFields)
			);
		});
		it('Validar a geração de uma linha para o GA com Parâmetros não encontrados', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Produto: 'fifinha',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Dispositivo: ['desktop e mobile'],
					Produto: ['fif'],
				},
				ga: {
					utm_source: ['Tipo de Compra', 'Dispositivo'],
					utm_campaign: ['Produto'],
				},
				googleads: {
					campanha: ['Tipo de Compra', 'Dispositivo'],
					ad: ['Produto'],
				},
			});
			const googleAds = new GoogleAds(csvLine, config);
			const googleAdsFields = {
				campanha: 'cpc:desktop_e_mobile',
				ad: 'Parâmetro(s) incorreto(s): Produto',
			};
			expect(JSON.stringify(googleAds.buildedLine())).to.equal(
				JSON.stringify(googleAdsFields)
			);
		});
	});
	describe('Valida a geração da linha do GoogleAds para GA com dependência de Configuração', () => {
		it('Validar a geração de uma linha para o GA com todos Parâmetros corretos', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Produto: 'fifinha',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Dispositivo: ['desktop e mobile'],
					Produto: ['/.*/'],
				},
				ga: {
					utm_source: ['Tipo de Compra', 'Dispositivo'],
					utm_campaign: ['Produto'],
				},
				googleads: {
					campanha: ['Tipo de Compra', 'Dispositivo'],
					ad: ['Produto'],
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc'],
						hasMatch: true,
						columnDestiny: 'Dipositivo',
						matches: ['/.*desktop.*/'],
					},
					{
						columnReference: 'Dispositivo',
						valuesReference: ['/.*mobile.*/'],
						hasMatch: true,
						columnDestiny: 'Produto',
						matches: ['/fifinha/'],
					},
				],
			});
			const googleAds = new GoogleAds(csvLine, config);
			let googleAdsFields = {
				campanha: 'cpc:desktop_e_mobile',
				ad: 'fifinha',
			};
			expect(JSON.stringify(googleAds.buildedLine())).to.equal(
				JSON.stringify(googleAdsFields)
			);
		});
		it('Validar a geração de uma linha para o GA com Parâmetros não encontrados', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Produto: 'fifinha',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Dispositivo: ['desktop e mobile'],
					Produto: ['fif'],
				},
				ga: {
					utm_source: ['Tipo de Compra', 'Dispositivo'],
					utm_campaign: ['Produto'],
				},
				googleads: {
					campanha: ['Tipo de Compra', 'Dispositivo'],
					ad: ['Produto'],
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc'],
						hasMatch: true,
						columnDestiny: 'Dipositivo',
						matches: ['/.*desktop.*/'],
					},
					{
						columnReference: 'Dispositivo',
						valuesReference: ['/.*mobile.*/'],
						hasMatch: true,
						columnDestiny: 'Produto',
						matches: ['/fifinha/'],
					},
				],
			});
			const googleAds = new GoogleAds(csvLine, config);
			const googleAdsFields = {
				campanha: 'cpc:desktop_e_mobile',
				ad: 'Parâmetro(s) incorreto(s): Produto',
			};
			expect(JSON.stringify(googleAds.buildedLine())).to.equal(
				JSON.stringify(googleAdsFields)
			);
		});
	});
});
