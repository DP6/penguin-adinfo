import { expect } from 'chai';
import { Adobe } from '../../src/ts/models/Adobe';

describe('Adobe', () => {
	describe('Valida a geração da linha do Adobe', () => {
		it('Validação caso o cid contenha parametros não passados', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
			};
			const config = {
				cid: ['Tipo de Compra', 'Bandeira', 'Veículo'],
			};
			const separators = {
				separator: ':',
				spaceSeparator: '_',
			};
			const rules = {
				'Tipo de Compra': ['cpa', 'cpc'],
			};
			const adobe = new Adobe(csvLine, config, separators, rules);
			const abodeFields = {
				cid: 'Parâmetros não encontrados: Bandeira, Veículo',
				'url adobe': 'Corrija os parâmetros para gerar a URL',
			};
			expect(JSON.stringify(adobe.buildedLine())).to.equal(
				JSON.stringify(abodeFields)
			);
		});
		it('Validação caso algum parâmetro esteja incorreto', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Bandeira: 'meuProduto',
				Veículo: 'meuVeiculo',
			};
			const config = {
				cid: ['Tipo de Compra', 'Bandeira', 'Veículo'],
			};
			const separators = {
				separator: ':',
				spaceSeparator: '_',
			};
			const rules = {
				'Tipo de Compra': ['cpa', 'cpc'],
				Bandeira: ['/meuProdut[ai]/'],
				Veículo: ['/.*/'],
			};
			const adobe = new Adobe(csvLine, config, separators, rules);
			const abodeFields = {
				cid: 'Parâmetros incorretos: Bandeira',
				'url adobe': 'Corrija os parâmetros para gerar a URL',
			};
			expect(JSON.stringify(adobe.buildedLine())).to.equal(
				JSON.stringify(abodeFields)
			);
		});
		it('Validação caso todos os parâmetros sejam informados corretamente', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Bandeira: 'meu Produto',
				Veículo: 'meuVeículo',
			};
			const config = {
				cid: ['Tipo de Compra', 'Bandeira', 'Veículo'],
			};
			const separators = {
				separator: ':',
				spaceSeparator: '_',
			};
			const rules = {
				'Tipo de Compra': ['cpa', 'cpc'],
				Bandeira: ['/meu\\ ?Produto/'],
			};
			const adobe = new Adobe(csvLine, config, separators, rules);
			const abodeFields = {
				cid: 'cpc:meu_produto:meuveiculo',
				'url adobe': 'www.teste.com.br?cid=cpc:meu_produto:meuveiculo',
			};
			expect(JSON.stringify(adobe.buildedLine())).to.equal(
				JSON.stringify(abodeFields)
			);
		});
	});
});
