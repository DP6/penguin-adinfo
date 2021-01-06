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
				ga: {
					utm_source: {
						'Tipo de Compra': ['cpa', 'cpc'],
						Dispositivo: ['desktop e mobile'],
					},
					utm_campaign: {
						Produto: ['/.*/'],
					},
				},
				googleads: {
					campanha: 'utm_source',
					ad: 'utm_campaign',
				},
			});
			const googleAds = new GoogleAds(csvLine, config);
			let googleAdsFields = {
				campanha: 'cpc:desktop_e_mobile',
				ad: 'fifinha',
				'url google ads': 'auto tagging',
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
				ga: {
					utm_source: {
						'Tipo de Compra': ['cpa', 'cpc'],
						Dispositivo: ['desktop e mobile'],
					},
					utm_campaign: {
						Produto: ['fif'],
					},
				},
				googleads: {
					campanha: 'utm_source',
					ad: 'utm_campaign',
				},
			});
			const googleAds = new GoogleAds(csvLine, config);
			const googleAdsFields = {
				campanha: 'cpc:desktop_e_mobile',
				ad: 'Parâmetro(s) incorreto(s): Produto',
				'url google ads': 'auto tagging',
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
				ga: {
					utm_source: {
						'Tipo de Compra': ['cpa', 'cpc'],
						Dispositivo: ['desktop e mobile'],
					},
				},
				googleads: {
					campanha: 'utm_source',
					ad: 'utm_campaign',
				},
			});
			const googleAds = new GoogleAds(csvLine, config);
			const googleAdsFields = {
				campanha: 'cpc:desktop_e_mobile',
				ad:
					'Parâmetro(s) não encontrado(s) na configuração: utm_campaign',
				'url google ads': 'auto tagging',
			};
			expect(JSON.stringify(googleAds.buildedLine())).to.equal(
				JSON.stringify(googleAdsFields)
			);
		});
	});
});
