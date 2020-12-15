import { expect } from 'chai';
import { FacebookAds } from '../../src/ts/models/FacebookAds';

describe('FacebookAds', () => {
	describe('Valida a geração da linha do FacebookAds para GA', () => {
		it('Validar a geração de uma linha para o GA com valores dinâmicos e sem parametros compostos', () => {
			let csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Produto: 'fifinha',
			};
			let config = {
				dynamicValues: 'true',
				utm_source: '{{ad.name}}',
				utm_campaign: '{{campaign.name}}',
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
			let facebookAds = new FacebookAds(
				csvLine,
				config,
				separators,
				rules,
				configTool
			);
			let facebookAdsFields = {
				'ad name': 'cpc:desktop_e_mobile',
				'campaign name': 'fifinha',
				'url facebook':
					'www.teste.com.br?utm_source={{ad.name}}&utm_campaign={{campaign.name}}',
			};
			expect(JSON.stringify(facebookAds.buildedLine)).to.equal(
				JSON.stringify(facebookAdsFields)
			);

			rules = {
				'Tipo de Compra': ['cpa', 'cpc'],
				Dispositivo: ['desktop e mobile'],
				Produto: ['fif'],
			};
			facebookAds = new FacebookAds(
				csvLine,
				config,
				separators,
				rules,
				configTool
			);
			facebookAdsFields = {
				'ad name': 'cpc:desktop_e_mobile',
				'campaign name': 'Parâmetros incorretos: Produto',
				'url facebook':
					'Para gerar a URL corrija o(s) parâmetro(s): campaign name',
			};
			expect(JSON.stringify(facebookAds.buildedLine)).to.equal(
				JSON.stringify(facebookAdsFields)
			);

			rules = {
				'Tipo de Compra': ['cpa', 'cpc'],
				Dispositivo: ['desktop e mobile'],
				Produto: ['fifinha'],
			};
			configTool = {
				utm_source: ['Tipo de Compra', 'Dispositivo'],
			};
			facebookAds = new FacebookAds(
				csvLine,
				config,
				separators,
				rules,
				configTool
			);
			facebookAdsFields = {
				'ad name': 'cpc:desktop_e_mobile',
				'campaign name':
					'Parâmetro(s) não encontrado(s) na configuração: utm_campaign',
				'url facebook':
					'Para gerar a URL corrija o(s) parâmetro(s): campaign name',
			};
			expect(JSON.stringify(facebookAds.buildedLine)).to.equal(
				JSON.stringify(facebookAdsFields)
			);
		});
	});
});
