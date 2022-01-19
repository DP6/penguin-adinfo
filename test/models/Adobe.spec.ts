import { expect } from 'chai';
import { Adobe } from '../../src/ts/models/Adobe';
import { Config } from '../../src/ts/models/Config';

describe('Adobe', () => {
	describe('Valida a geração da linha do Adobe', () => {
		it('Validação caso o cid contenha parametros não passados', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
			};
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
			const adobe = new Adobe(csvLine, config);
			const abodeFields = {
				cid: 'Parâmetros não encontrados: Bandeira - Veículo',
				'url adobe': 'Corrija os parâmetros para gerar a URL',
			};
			expect(JSON.stringify(adobe.buildedLine().values)).to.equal(
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
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Bandeira: ['/meuProdut[ai]/'],
					Veículo: ['/.*/'],
				},
				adobe: {
					cid: ['Tipo de Compra', 'Bandeira', 'Veículo'],
				},
			});
			const adobe = new Adobe(csvLine, config);
			const abodeFields = {
				cid: 'Parâmetros incorretos: Bandeira',
				'url adobe': 'Corrija os parâmetros para gerar a URL',
			};
			expect(JSON.stringify(adobe.buildedLine().values)).to.equal(
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
			const adobe = new Adobe(csvLine, config);
			const abodeFields = {
				cid: 'cpc:meu_produto:meuveiculo',
				'url adobe': 'www.teste.com.br?cid=cpc:meu_produto:meuveiculo',
			};
			expect(JSON.stringify(adobe.buildedLine().values)).to.equal(
				JSON.stringify(abodeFields)
			);
		});
		it('Validação caso a URL possua uma ancora', () => {
			const csvLine = {
				Url: 'www.teste.com.br#ancora',
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
			const adobe = new Adobe(csvLine, config);
			const abodeFields = {
				cid: 'cpc:meu_produto:meuveiculo',
				'url adobe': 'www.teste.com.br?cid=cpc:meu_produto:meuveiculo#ancora',
			};
			expect(JSON.stringify(adobe.buildedLine().values)).to.equal(
				JSON.stringify(abodeFields)
			);
		});
	});
	describe('Valida a geração da linha do Adobe com configuração de dependência', () => {
		it('Validação caso todos os parâmetros sejam informados corretamente', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Veículo: 'facebook',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Dispositivo: [],
					Veículo: [],
				},
				adobe: {
					cid: ['Tipo de Compra', 'Dispositivo', 'Veículo'],
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc'],
						hasMatch: true,
						columnDestiny: 'Dispositivo',
						matches: ['/desktop/'],
					},
				],
			});
			const adobe = new Adobe(csvLine, config);
			const abodeFields = {
				cid: 'cpc:desktop_e_mobile:facebook',
				'url adobe':
					'www.teste.com.br?cid=cpc:desktop_e_mobile:facebook',
			};
			expect(JSON.stringify(adobe.buildedLine().values)).to.equal(
				JSON.stringify(abodeFields)
			);
		});
		it('Validação caso todos os parâmetros sejam informados corretamente com duas dependências para o mesmo campo', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Veículo: 'facebook',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Bandeira: [],
					Dispositivo: [],
					Veículo: [],
				},
				adobe: {
					cid: ['Tipo de Compra', 'Dispositivo', 'Veículo'],
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc'],
						hasMatch: true,
						columnDestiny: 'Dispositivo',
						matches: ['/desktop/'],
					},
					{
						columnReference: 'Veículo',
						valuesReference: ['/face/'],
						hasMatch: false,
						columnDestiny: 'Dispositivo',
						matches: ['google'],
					},
				],
			});
			const adobe = new Adobe(csvLine, config);
			const abodeFields = {
				cid: 'cpc:desktop_e_mobile:facebook',
				'url adobe':
					'www.teste.com.br?cid=cpc:desktop_e_mobile:facebook',
			};
			expect(JSON.stringify(adobe.buildedLine().values)).to.equal(
				JSON.stringify(abodeFields)
			);
		});
		it('Validação com duas dependências para o mesmo campo e um erro em uma delas', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Veículo: 'facebook',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Bandeira: [],
					Dispositivo: [],
					Veículo: [],
				},
				adobe: {
					cid: ['Tipo de Compra', 'Dispositivo', 'Veículo'],
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc'],
						hasMatch: true,
						columnDestiny: 'Dispositivo',
						matches: ['/desktop/'],
					},
					{
						columnReference: 'Veículo',
						valuesReference: ['/face/'],
						hasMatch: false,
						columnDestiny: 'Dispositivo',
						matches: ['/mobile/'],
					},
				],
			});
			const adobe = new Adobe(csvLine, config);
			const abodeFields = {
				cid: 'Parâmetros incorretos: Dispositivo',
				'url adobe': 'Corrija os parâmetros para gerar a URL',
			};
			expect(JSON.stringify(adobe.buildedLine().values)).to.equal(
				JSON.stringify(abodeFields)
			);
		});
		it('Validação caso os parâmetros não correspondam as configurações de dependência', () => {
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
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpa'],
						hasMatch: true,
						columnDestiny: 'Dispositivo',
						matches: ['dispositivo'],
					},
				],
			});
			const adobe = new Adobe(csvLine, config);
			const abodeFields = {
				cid: 'cpc:meu_produto:meuveiculo',
				'url adobe': 'www.teste.com.br?cid=cpc:meu_produto:meuveiculo',
			};
			expect(JSON.stringify(adobe.buildedLine().values)).to.equal(
				JSON.stringify(abodeFields)
			);
		});
	});
});
