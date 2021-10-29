import { expect } from 'chai';
import { Builder } from '../../src/ts/controllers/Builder';
import { Config } from '../../src/ts/models/Config';

describe('Builder', () => {
	describe('Valida a geração do csv para Adobe', () => {
		it('Validação caso o cid esteja correto', () => {
			const csvLine = [
				{
					Url: 'www.teste.com.br',
					'Tipo de Compra': 'cpc',
					Dispositivo: 'desktop e mobile',
					Bandeira: 'meu Produto',
					Veículo: 'meuVeículo',
				},
			];
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Bandeira: [],
					Veículo: [],
				},
				adobe: {
					cid: ['Tipo de Compra', 'Bandeira', 'Veículo'],
				},
			});
			const builder = new Builder(csvLine, config, 'adobe');
			const abodeFields = [
				{
					Url: 'www.teste.com.br',
					'Tipo de Compra': 'cpc',
					Dispositivo: 'desktop e mobile',
					Bandeira: 'meu Produto',
					Veículo: 'meuVeículo',
					cid: 'cpc:meu_produto:meuveiculo',
					'url adobe':
						'www.teste.com.br?cid=cpc:meu_produto:meuveiculo',
					hasError: false
				},
			];
			expect(JSON.stringify(builder.build())).to.equal(
				JSON.stringify(abodeFields)
			);
		});
	});
	describe('Valida a geração do csv para GA', () => {
		it('Validação caso os utms estejam corretos', () => {
			const csvLine = [
				{
					Url: 'www.teste.com.br',
					'Tipo de Compra': 'cpc',
					Dispositivo: 'desktop e mobile',
					Período: 'Maio 2020',
					Bandeira: 'Minha Bandeira',
				},
			];
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Período: ['/[a-zA-Z]* [0-9]{4}/'],
					Bandeira: [],
				},
				ga: {
					utm_medium: ['Tipo de Compra'],
					utm_campaign: ['Período', 'Bandeira'],
				},
			});
			const builder = new Builder(csvLine, config, 'ga');
			const gaFields = [
				{
					Url: 'www.teste.com.br',
					'Tipo de Compra': 'cpc',
					Dispositivo: 'desktop e mobile',
					Período: 'Maio 2020',
					Bandeira: 'Minha Bandeira',
					utm_medium: 'cpc',
					utm_campaign: 'maio_2020:minha_bandeira',
					'url ga':
						'www.teste.com.br?utm_medium=cpc&utm_campaign=maio_2020:minha_bandeira',
					hasError: false
				},
			];
			expect(JSON.stringify(builder.build())).to.equal(
				JSON.stringify(gaFields)
			);
		});
	});
});
