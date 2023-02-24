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
					'Tipo de Compra': {"data":['cpa', 'cpc'], "index": 0},
					Bandeira: ['/meu\\ ?Produto/'],
					Veículo: [],
				},
				analyticsTools: {
					adobe: {
						cid: ['Tipo de Compra', 'Bandeira', 'Veículo'],
					}
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
					'Tipo de Compra': {"data":['cpa', 'cpc'], "index": 0},
					Bandeira: ['/meu\\ ?Produto/'],
				},
				analyticsTools: {
					ga: {
						utm_source: ['Tipo de Compra', 'Bandeira'],
					}
				},
			});
			const object = new ParametrizerFactory(csvLine, config).build('ga');
			expect(object.constructor.name).to.equal('GA');
		});
		it('Criação do Factory para Veículo Genérico', () => {
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
					'Tipo de Compra': {"data":['cpa', 'cpc'], "index": 0},
					Dispositivo: ['desktop e mobile'],
					Veículo: ['/.*/'],
				},
				analyticsTools: {
					ga: {
						utm_source: ['Dispositivo'],
						utm_campaign: ['Tipo de Compra', 'Veículo'],
					}
				},
				mediaTaxonomy: {
					criteo: {
						ad: ['Dispositivo'],
						campaign: ['Tipo de Compra', 'Veículo'],
					}
				},
			});
			const object = new ParametrizerFactory(csvLine, config).build(
				'criteo'
			);
			expect(object.constructor.name).to.equal('GeneralVehicle');
		});
	});
});
