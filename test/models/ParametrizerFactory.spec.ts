import { expect } from 'chai';
import { ParametrizerFactory } from '../../src/ts/models/ParametrizerFactory';
import { Config } from '../../src/ts/models/Config';

describe('ParametrizerFactory', () => {
	describe('Verifica se o Factory está criando as classes corretamente', () => {
		it('Criação do Factory para adobe', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Bandeira: 'meu Produto',
				Veículo: 'meuVeículo',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				adobe: {
					cid: {
						'Tipo de Compra': ['cpa', 'cpc'],
						Bandeira: ['/meu\\ ?Produto/'],
						Veículo: [],
					},
				},
			});
			const object = new ParametrizerFactory(csvLine, config).build(
				'adobe'
			);
			expect(object.constructor.name).to.equal('Adobe');
		});
		it('Criação do Factory para GA', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Bandeira: 'meu Produto',
				Veículo: 'meuVeículo',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				ga: {
					utm_source: {
						'Tipo de Compra': ['cpa', 'cpc'],
						Bandeira: ['/meu\\ ?Produto/'],
					},
				},
			});
			const object = new ParametrizerFactory(csvLine, config).build('ga');
			expect(object.constructor.name).to.equal('GA');
		});
		it('Criação do Factory para GoogleAds', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Bandeira: 'meu Produto',
				Veículo: 'meuVeículo',
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
			const object = new ParametrizerFactory(csvLine, config).build(
				'googleads'
			);
			expect(object.constructor.name).to.equal('GoogleAds');
		});
		it('Criação do Factory para FacebookAds', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Bandeira: 'meu Produto',
				Veículo: 'meuVeículo',
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
			const object = new ParametrizerFactory(csvLine, config).build(
				'facebookads'
			);
			expect(object.constructor.name).to.equal('FacebookAds');
		});
	});
});
