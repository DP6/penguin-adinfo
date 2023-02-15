import { expect } from 'chai';
import { GA } from '../../src/ts/models/GA';
import { Config } from '../../src/ts/models/Config';

describe('GA', () => {
	describe('Valida a geração da linha do GA', () => {
		it('Validação caso os utms contenha parametros não passados', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': {"data":['cpa', 'cpc'], "index": 0},
					Período: [],
					Bandeira: [],
				},
				analyticsTools: {
					ga: {
						utm_medium: ['Tipo de Compra'],
						utm_campaign: ['Período', 'Bandeira'],
					},
				}
			});
			const ga = new GA(csvLine, config);
			const gaFields = {
				utm_medium: 'cpc',
				utm_campaign:
					'Parâmetros não encontrados: Período - Bandeira',
				'url ga': 'Corrija os parâmetros para gerar a URL',
			};
			expect(JSON.stringify(ga.buildedLine().values)).to.equal(
				JSON.stringify(gaFields)
			);
		});
		it('Validação caso algum parâmetro esteja incorreto', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Período: 'Maio 2020',
				Bandeira: 'Minha Bandeira',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': {"data":['cpa', 'cpc'], "index": 0},
					Período: ['/[a-zA-Z]* [0-9]{4}/'],
					Bandeira: ['bandeira2'],
				},
				analyticsTools: {
					ga: {
						utm_medium: ['Tipo de Compra'],
						utm_campaign: ['Período', 'Bandeira'],
					},
				}
			});
			const ga = new GA(csvLine, config);
			const gaFields = {
				utm_medium: 'cpc',
				utm_campaign: 'Parâmetros incorretos: Bandeira',
				'url ga': 'Corrija os parâmetros para gerar a URL',
			};
			expect(JSON.stringify(ga.buildedLine().values)).to.equal(
				JSON.stringify(gaFields)
			);
		});
		it('Validação caso todos os parâmetros sejam informados corretamente', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Período: 'Maio 2020',
				Bandeira: 'Minha Bandeira',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': {"data":['cpa', 'cpc'], "index": 0},
					Período: ['/[a-zA-Z]* [0-9]{4}/'],
					Bandeira: [],
				},
				analyticsTools: {
					ga: {
						utm_medium: ['Tipo de Compra'],
						utm_campaign: ['Período', 'Bandeira'],
					},
				}
			});
			const ga = new GA(csvLine, config);
			const gaFields = {
				utm_medium: 'cpc',
				utm_campaign: 'maio_2020:minha_bandeira',
				'url ga':
					'www.teste.com.br?utm_medium=cpc&utm_campaign=maio_2020:minha_bandeira',
			};
			expect(JSON.stringify(ga.buildedLine().values)).to.equal(
				JSON.stringify(gaFields)
			);
		});
		it('Validação caso a URL possua uma ancora', () => {
			const csvLine = {
				Url: 'www.teste.com.br#ancora',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Período: 'Maio 2020',
				Bandeira: 'Minha Bandeira',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': {"data":['cpa', 'cpc'], "index": 0},
					Período: ['/[a-zA-Z]* [0-9]{4}/'],
					Bandeira: [],
				},
				analyticsTools: {
					ga: {
						utm_medium: ['Tipo de Compra'],
						utm_campaign: ['Período', 'Bandeira'],
					},
				}
			});
			const ga = new GA(csvLine, config);
			const gaFields = {
				utm_medium: 'cpc',
				utm_campaign: 'maio_2020:minha_bandeira',
				'url ga':
					'www.teste.com.br?utm_medium=cpc&utm_campaign=maio_2020:minha_bandeira#ancora',
			};
			expect(JSON.stringify(ga.buildedLine().values)).to.equal(
				JSON.stringify(gaFields)
			);
		});
		it('Validação caso a URL possua um parametro', () => {
			const csvLine = {
				Url: 'www.teste.com.br?search=produtos',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Período: 'Maio 2020',
				Bandeira: 'Minha Bandeira',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': {"data":['cpa', 'cpc'], "index": 0},
					Período: ['/[a-zA-Z]* [0-9]{4}/'],
					Bandeira: [],
				},
				analyticsTools: {
					ga: {
						utm_medium: ['Tipo de Compra'],
						utm_campaign: ['Período', 'Bandeira'],
					},
				}
			});
			const ga = new GA(csvLine, config);
			const gaFields = {
				utm_medium: 'cpc',
				utm_campaign: 'maio_2020:minha_bandeira',
				'url ga':
					'www.teste.com.br?search=produtos&utm_medium=cpc&utm_campaign=maio_2020:minha_bandeira',
			};
			expect(JSON.stringify(ga.buildedLine().values)).to.equal(
				JSON.stringify(gaFields)
			);
		});
		it('Validação caso a URL possua um parametro e uma ancora', () => {
			const csvLine = {
				Url: 'www.teste.com.br?search=produtos#ancora',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Período: 'Maio 2020',
				Bandeira: 'Minha Bandeira',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': {"data":['cpa', 'cpc'], "index": 0},
					Período: ['/[a-zA-Z]* [0-9]{4}/'],
					Bandeira: [],
				},
				analyticsTools: {
					ga: {
						utm_medium: ['Tipo de Compra'],
						utm_campaign: ['Período', 'Bandeira'],
					},
				}
			});
			const ga = new GA(csvLine, config);
			const gaFields = {
				utm_medium: 'cpc',
				utm_campaign: 'maio_2020:minha_bandeira',
				'url ga':
					'www.teste.com.br?search=produtos&utm_medium=cpc&utm_campaign=maio_2020:minha_bandeira#ancora',
			};
			expect(JSON.stringify(ga.buildedLine().values)).to.equal(
				JSON.stringify(gaFields)
			);
		});
	});
	describe('Valida a geração da linha do GA com configuração de dependência', () => {
		it('Validação caso todos os parâmetros sejam informados corretamente', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Período: 'Maio 2020',
				Bandeira: 'Minha Bandeira',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': {"data":['cpa', 'cpc'], "index": 0},
					Período: ['/[a-zA-Z]* [0-9]{4}/'],
					Bandeira: [],
				},
				analyticsTools: {
					ga: {
						utm_medium: ['Tipo de Compra'],
						utm_campaign: ['Período', 'Bandeira'],
					},
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpa'],
						hasMatch: true,
						columnDestiny: 'Bandeira',
						matches: ['minhaBandeirinha'],
					},
				],
			});
			const ga = new GA(csvLine, config);
			const gaFields = {
				utm_medium: 'cpc',
				utm_campaign: 'maio_2020:minha_bandeira',
				'url ga':
					'www.teste.com.br?utm_medium=cpc&utm_campaign=maio_2020:minha_bandeira',
			};
			expect(JSON.stringify(ga.buildedLine().values)).to.equal(
				JSON.stringify(gaFields)
			);
		});
		it('Validação caso todos os parâmetros sejam informados corretamente com duas dependências para o mesmo campo', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpa',
				Dispositivo: 'desktop e mobile',
				Período: 'Maio 2020',
				Bandeira: 'Minha_Bandeira',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': {"data":['cpa', 'cpc'], "index": 0},
					Período: ['/[a-zA-Z]* [0-9]{4}/'],
					Bandeira: [],
				},
				analyticsTools: {
					ga: {
						utm_medium: ['Tipo de Compra'],
						utm_campaign: ['Período', 'Bandeira'],
					},
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpa'],
						hasMatch: true,
						columnDestiny: 'Bandeira',
						matches: ['/Minha/'],
					},
					{
						columnReference: 'Dispositivo',
						valuesReference: ['/.*desktop.*/'],
						hasMatch: true,
						columnDestiny: 'Bandeira',
						matches: ['/Bandeira/'],
					},
				],
			});
			const ga = new GA(csvLine, config);
			const gaFields = {
				utm_medium: 'cpa',
				utm_campaign: 'maio_2020:minha_bandeira',
				'url ga':
					'www.teste.com.br?utm_medium=cpa&utm_campaign=maio_2020:minha_bandeira',
			};
			expect(JSON.stringify(ga.buildedLine().values)).to.equal(
				JSON.stringify(gaFields)
			);
		});
		it('Validação com erro na validação de uma das dependências para um mesmo campo', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpa',
				Dispositivo: 'desktop e mobile',
				Período: 'Maio 2020',
				Bandeira: 'Bandeira',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': {"data":['cpa', 'cpc'], "index": 0},
					Período: ['/[a-zA-Z]* [0-9]{4}/'],
					Bandeira: [],
				},
				analyticsTools: {
					ga: {
						utm_medium: ['Tipo de Compra'],
						utm_campaign: ['Período', 'Bandeira'],
					},
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpa'],
						hasMatch: true,
						columnDestiny: 'Bandeira',
						matches: ['/Minha/'],
					},
					{
						columnReference: 'Dispositivo',
						valuesReference: ['/.*desktop.*/'],
						hasMatch: true,
						columnDestiny: 'Bandeira',
						matches: ['/Bandeira/'],
					},
				],
			});
			const ga = new GA(csvLine, config);
			const gaFields = {
				utm_medium: 'cpa',
				utm_campaign: 'Parâmetros incorretos: Bandeira',
				'url ga': 'Corrija os parâmetros para gerar a URL',
			};
			expect(JSON.stringify(ga.buildedLine().values)).to.equal(
				JSON.stringify(gaFields)
			);
		});
		it('Validação caso os parâmetros não correspondam as configurações de dependência', () => {
			const csvLine = {
				Url: 'www.teste.com.br',
				'Tipo de Compra': 'cpc',
				Dispositivo: 'desktop e mobile',
				Período: 'Maio 2020',
				Bandeira: 'Minha Bandeira',
			};
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': {"data":['cpa', 'cpc'], "index": 0},
					Período: ['/[a-zA-Z]* [0-9]{4}/'],
					Bandeira: [],
				},
				analyticsTools: {
					ga: {
						utm_medium: ['Tipo de Compra'],
						utm_campaign: ['Período', 'Bandeira'],
					},
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc'],
						hasMatch: true,
						columnDestiny: 'Bandeira',
						matches: ['bandeira1', 'bandeira2'],
					},
				],
			});
			const ga = new GA(csvLine, config);
			const gaFields = {
				utm_medium: 'cpc',
				utm_campaign: 'Parâmetros incorretos: Bandeira',
				'url ga': 'Corrija os parâmetros para gerar a URL',
			};
			expect(JSON.stringify(ga.buildedLine().values)).to.equal(
				JSON.stringify(gaFields)
			);
		});
	});
});
