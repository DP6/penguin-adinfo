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
				ga: {
					utm_medium: {
						'Tipo de Compra': ['cpa', 'cpc'],
					},
					utm_campaign: {
						Período: [],
						Bandeira: [],
					},
				},
			});
			const ga = new GA(csvLine, config);
			const gaFields = {
				utms: {
					utm_medium: 'cpc',
					utm_campaign:
						'Parâmetros não encontrados: Período, Bandeira',
				},
				'url ga': 'Corrija os parâmetros para gerar a URL',
			};
			expect(JSON.stringify(ga.buildedLine())).to.equal(
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
				ga: {
					utm_medium: {
						'Tipo de Compra': ['cpa', 'cpc'],
					},
					utm_campaign: {
						Período: ['/[a-zA-Z]* [0-9]{4}/'],
						Bandeira: ['bandeira2'],
					},
				},
			});
			const ga = new GA(csvLine, config);
			const gaFields = {
				utms: {
					utm_medium: 'cpc',
					utm_campaign: 'Parâmetros incorretos: Bandeira',
				},
				'url ga': 'Corrija os parâmetros para gerar a URL',
			};
			expect(JSON.stringify(ga.buildedLine())).to.equal(
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
				ga: {
					utm_medium: {
						'Tipo de Compra': ['cpa', 'cpc'],
					},
					utm_campaign: {
						Período: ['/[a-zA-Z]* [0-9]{4}/'],
						Bandeira: [],
					},
				},
			});
			const ga = new GA(csvLine, config);
			const gaFields = {
				utms: {
					utm_medium: 'cpc',
					utm_campaign: 'maio_2020:minha_bandeira',
				},
				'url ga':
					'www.teste.com.br?utm_medium=cpc&utm_campaign=maio_2020:minha_bandeira',
			};
			expect(JSON.stringify(ga.buildedLine())).to.equal(
				JSON.stringify(gaFields)
			);
		});
	});
});
