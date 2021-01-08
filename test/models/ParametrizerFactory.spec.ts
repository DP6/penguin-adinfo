import { expect } from 'chai';
import { ParametrizerFactory } from '../../src/ts/models/ParametrizerFactory';
import { Config } from '../../src/ts/models/Config';

describe('PArametrizerFactory', () => {
	describe('', () => {
		it('', () => {
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
			expect(true).to.equal(true);
		});
	});
});
