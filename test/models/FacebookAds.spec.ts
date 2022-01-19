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
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Dispositivo: ['desktop e mobile'],
					Produto: ['/.*/'],
				},
				ga: {
					utm_source: ['Tipo de Compra', 'Dispositivo'],
					utm_campaign: ['Produto'],
				},
				facebookads: {
					'ad.name': ['Tipo de Compra', 'Dispositivo'],
					'campaign.name': ['Produto'],
				},
			});
			const facebookAds = new FacebookAds(csvLine, config);
			const facebookAdsFields = {
				'ad name': 'cpc:desktop_e_mobile',
				'campaign name': 'fifinha',
			};
			expect(JSON.stringify(facebookAds.buildedLine().values)).to.equal(
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
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Dispositivo: ['desktop e mobile'],
					Produto: ['fif'],
				},
				ga: {
					utm_source: ['Tipo de Compra', 'Dispositivo'],
					utm_campaign: ['Produto'],
				},
				facebookads: {
					'ad.name': ['Tipo de Compra', 'Dispositivo'],
					'campaign.name': ['Produto'],
				},
			});
			const facebookAds = new FacebookAds(csvLine, config);
			const facebookAdsFields = {
				'ad name': 'cpc:desktop_e_mobile',
				'campaign name': 'Parâmetros incorretos: Produto',
			};
			expect(JSON.stringify(facebookAds.buildedLine().values)).to.equal(
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
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Dispositivo: ['desktop e mobile'],
				},
				ga: {
					utm_source: ['Tipo de Compra', 'Dispositivo'],
				},
				facebookads: {
					'ad.name': ['Tipo de Compra', 'Dispositivo'],
					'campaign.name': ['Produto'],
				},
			});
			const facebookAds = new FacebookAds(csvLine, config);
			const facebookAdsFields = {
				'ad name': 'cpc:desktop_e_mobile',
				'campaign name':
					'Parâmetro(s) não encontrado(s) na configuração: Produto',
			};
			expect(JSON.stringify(facebookAds.buildedLine().values)).to.equal(
				JSON.stringify(facebookAdsFields)
			);
		});
	});
	describe('Valida a geração da linha do FacebookAds para GA com dependência de campos', () => {
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
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Dispositivo: ['desktop e mobile'],
					Produto: ['/.*/'],
				},
				ga: {
					utm_source: ['Tipo de Compra', 'Dispositivo'],
					utm_campaign: ['Produto'],
				},
				facebookads: {
					'ad.name': ['Tipo de Compra', 'Dispositivo'],
					'campaign.name': ['Produto'],
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc'],
						hasMatch: false,
						columnDestiny: 'Dispositivo',
						matches: ['/.*fifa.*/'],
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
			const facebookAds = new FacebookAds(csvLine, config);
			const facebookAdsFields = {
				'ad name': 'cpc:desktop_e_mobile',
				'campaign name': 'fifinha',
			};
			expect(JSON.stringify(facebookAds.buildedLine().values)).to.equal(
				JSON.stringify(facebookAdsFields)
			);
		});
		it('Validar a geração de uma linha para o GA com valores dinâmicos e sem parametros compostos', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Produto: 'fif',
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
				facebookads: {
					'ad.name': ['Tipo de Compra', 'Dispositivo'],
					'campaign.name': ['Produto'],
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc'],
						hasMatch: false,
						columnDestiny: 'Produto',
						matches: ['fif'],
					},
					{
						columnReference: 'Dispositivo',
						valuesReference: ['/.*mobile.*/'],
						hasMatch: true,
						columnDestiny: 'Tipo de Compra',
						matches: ['/.*/'],
					},
				],
			});
			const facebookAds = new FacebookAds(csvLine, config);
			const facebookAdsFields = {
				'ad name': 'cpc:desktop_e_mobile',
				'campaign name': 'Parâmetros incorretos: Produto',
			};
			expect(JSON.stringify(facebookAds.buildedLine().values)).to.equal(
				JSON.stringify(facebookAdsFields)
			);
		});
		it('Validar a geração de uma linha para o GA com valores dinâmicos e sem parametros compostos com duas dependências para o mesmo campo', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Produto: 'fif',
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
				facebookads: {
					'ad.name': ['Tipo de Compra', 'Dispositivo'],
					'campaign.name': ['Produto'],
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc'],
						hasMatch: true,
						columnDestiny: 'Produto',
						matches: ['fif'],
					},
					{
						columnReference: 'Dispositivo',
						valuesReference: ['/.*mobile.*/'],
						hasMatch: false,
						columnDestiny: 'Produto',
						matches: ['fifinha'],
					},
				],
			});
			const facebookAds = new FacebookAds(csvLine, config);
			const facebookAdsFields = {
				'ad name': 'cpc:desktop_e_mobile',
				'campaign name': 'fif',
			};
			expect(JSON.stringify(facebookAds.buildedLine().values)).to.equal(
				JSON.stringify(facebookAdsFields)
			);
		});
		it('Validar a geração de uma linha para o GA com valores dinâmicos e sem parametros compostos com erro em uma das dependências para o mesmo campo', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Produto: 'fif',
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
				facebookads: {
					'ad.name': ['Tipo de Compra', 'Dispositivo'],
					'campaign.name': ['Produto'],
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc'],
						hasMatch: false,
						columnDestiny: 'Produto',
						matches: ['fif'],
					},
					{
						columnReference: 'Dispositivo',
						valuesReference: ['/.*mobile.*/'],
						hasMatch: false,
						columnDestiny: 'Produto',
						matches: ['fifinha'],
					},
				],
			});
			const facebookAds = new FacebookAds(csvLine, config);
			const facebookAdsFields = {
				'ad name': 'cpc:desktop_e_mobile',
				'campaign name': 'Parâmetros incorretos: Produto',
			};
			expect(JSON.stringify(facebookAds.buildedLine().values)).to.equal(
				JSON.stringify(facebookAdsFields)
			);
		});
	});
});
