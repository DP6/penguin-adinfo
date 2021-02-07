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
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Bandeira: ['/meu\\ ?Produto/'],
					Veículo: [],
				},
				adobe: {
					cid: ['Tipo de Compra', 'Bandeira', 'Veículo'],
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
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Bandeira: ['/meu\\ ?Produto/'],
				},
				ga: {
					utm_source: ['Tipo de Compra', 'Bandeira'],
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
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Dispositivo: ['desktop e mobile'],
				},
				ga: {
					utm_source: ['Tipo de Compra', 'Dispositivo'],
				},
				googleads: {
					campanha: ['Tipo de Compra', 'Dispositivo'],
					ad: ['Produto'],
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
			const object = new ParametrizerFactory(csvLine, config).build(
				'facebookads'
			);
			expect(object.constructor.name).to.equal('FacebookAds');
		});
	});
});
