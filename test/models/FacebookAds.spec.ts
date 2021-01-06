import { expect } from 'chai';
import { FacebookAds } from '../../src/ts/models/FacebookAds';
import { Config } from '../../src/ts/models/Config';

describe('FacebookAds', () => {
	describe('Valida a geração da linha do FacebookAds para GA', () => {
		it('Validar a geração de uma linha para o GA com valores dinâmicos e sem parametros compostos > Todos os parâmetros informados corretamente', () => {
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
				facebookads: {
					dynamicValues: 'true',
					utm_source: '{{ad.name}}',
					utm_campaign: '{{campaign.name}}',
				},
			});
			const facebookAds = new FacebookAds(csvLine, config);
			const facebookAdsFields = {
				'ad name': 'cpc:desktop_e_mobile',
				'campaign name': 'fifinha',
				'url facebook':
					'www.teste.com.br?utm_source={{ad.name}}&utm_campaign={{campaign.name}}',
			};
			expect(JSON.stringify(facebookAds.buildedLine())).to.equal(
				JSON.stringify(facebookAdsFields)
			);
		});
		it('Validar a geração de uma linha para o GA com valores dinâmicos e sem parametros compostos', () => {
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
				facebookads: {
					dynamicValues: 'true',
					utm_source: '{{ad.name}}',
					utm_campaign: '{{campaign.name}}',
				},
			});
			const facebookAds = new FacebookAds(csvLine, config);
			const facebookAdsFields = {
				'ad name': 'cpc:desktop_e_mobile',
				'campaign name': 'Parâmetros incorretos: Produto',
				'url facebook':
					'Para gerar a URL corrija o(s) parâmetro(s): campaign name',
			};
			expect(JSON.stringify(facebookAds.buildedLine())).to.equal(
				JSON.stringify(facebookAdsFields)
			);
		});
		it('Validar a geração de uma linha para o GA com valores dinâmicos e sem parametros compostos > Parâmetro não encontrado', () => {
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
				facebookads: {
					dynamicValues: 'true',
					utm_source: '{{ad.name}}',
					utm_campaign: '{{campaign.name}}',
				},
			});
			const facebookAds = new FacebookAds(csvLine, config);
			const facebookAdsFields = {
				'ad name': 'cpc:desktop_e_mobile',
				'campaign name':
					'Parâmetro(s) não encontrado(s) na configuração: utm_campaign',
				'url facebook':
					'Para gerar a URL corrija o(s) parâmetro(s): campaign name',
			};
			expect(JSON.stringify(facebookAds.buildedLine())).to.equal(
				JSON.stringify(facebookAdsFields)
			);
		});
	});
});
