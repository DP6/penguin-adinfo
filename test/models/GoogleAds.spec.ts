import { expect } from 'chai';
import { GoogleAds } from '../../src/ts/models/GoogleAds';

describe('GoogleAds', () => {
	describe('Valida a geração da linha do GoogleAds para GA', () => {
		it('Validar a geração de uma linha para o GA', () => {
			let csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Produto: 'fifinha',
			};
			let config = {
				campanha: 'utm_source',
				ad: 'utm_campaign',
			};
			let separators = {
				separator: ':',
				spaceSeparator: '_',
			};
			let rules = {
				'Tipo de Compra': ['cpa', 'cpc'],
				Dispositivo: ['desktop e mobile'],
				Produto: ['/.*/'],
			};
			let configTool: { [key: string]: string[] } = {
				utm_source: ['Tipo de Compra', 'Dispositivo'],
				utm_campaign: ['Produto'],
			};
			let googleAds = new GoogleAds(
				csvLine,
				config,
				separators,
				rules,
				configTool
			);
			let googleAdsFields = {
				campanha: 'cpc:desktop_e_mobile',
				ad: 'fifinha',
				'url google ads': 'auto tagging',
			};
			expect(JSON.stringify(googleAds.buildedLine())).to.equal(
				JSON.stringify(googleAdsFields)
			);

			rules = {
				'Tipo de Compra': ['cpa', 'cpc'],
				Dispositivo: ['desktop e mobile'],
				Produto: ['fif'],
			};
			googleAds = new GoogleAds(
				csvLine,
				config,
				separators,
				rules,
				configTool
			);
			googleAdsFields = {
				campanha: 'cpc:desktop_e_mobile',
				ad: 'Parâmetro(s) incorreto(s): Produto',
				'url google ads': 'auto tagging',
			};
			expect(JSON.stringify(googleAds.buildedLine())).to.equal(
				JSON.stringify(googleAdsFields)
			);

			rules = {
				'Tipo de Compra': ['cpa', 'cpc'],
				Dispositivo: ['desktop e mobile'],
				Produto: ['fifinha'],
			};
			configTool = {
				utm_source: ['Tipo de Compra', 'Dispositivo'],
			};
			googleAds = new GoogleAds(
				csvLine,
				config,
				separators,
				rules,
				configTool
			);
			googleAdsFields = {
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
