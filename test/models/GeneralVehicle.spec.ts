import { expect } from 'chai';
import { GeneralVehicle } from '../../src/ts/models/GeneralVehicle';
import { Config } from '../../src/ts/models/Config';

describe('Veículo Genérico', () => {
	describe('Valida a geração da linha do GeneralVehicle para GA', () => {
		it('Validar a geração de uma linha para o GA com todos Parâmetros corretos', () => {
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
				analyticsTools: {
					ga: {
						utm_source: ['Tipo de Compra', 'Dispositivo'],
						utm_campaign: ['Produto'],
					}
				},
				mediaTaxonomy: {
					criteo: {
						campanha: ['Tipo de Compra', 'Dispositivo'],
						ad: ['Produto'],
					}
				},
			});
			const criteo = new GeneralVehicle(csvLine, config, 'criteo');
			let criteoFields = {
				campanha: 'cpc:desktop_e_mobile',
				ad: 'fifinha',
			};
			expect(JSON.stringify(criteo.buildedLine().values)).to.equal(
				JSON.stringify(criteoFields)
			);
		});
		it('Validar a geração de uma linha para o GA com Parâmetros incorretos', () => {
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
				analyticsTools: {
					ga: {
						utm_source: ['Tipo de Compra', 'Dispositivo'],
						utm_campaign: ['Produto'],
					}
				},
				mediaTaxonomy: {
					criteo: {
						campanha: ['Tipo de Compra', 'Dispositivo'],
						ad: ['Produto'],
					}
				},
			});
			const criteo = new GeneralVehicle(csvLine, config, 'criteo');
			const criteoFields = {
				campanha: 'cpc:desktop_e_mobile',
				ad: 'Parâmetro(s) incorreto(s): Produto',
			};
			expect(JSON.stringify(criteo.buildedLine().values)).to.equal(
				JSON.stringify(criteoFields)
			);
		});
		it('Validar a geração de uma linha para o GA com Parâmetros não encontrados', () => {
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
				analyticsTools: {
					ga: {
						utm_source: ['Tipo de Compra', 'Dispositivo'],
						utm_campaign: ['Produto'],
					}
				},
				mediaTaxonomy: {
					criteo: {
						campanha: ['Tipo de Compra', 'Dispositivo'],
						ad: ['Produto'],
					}
				},
			});
			const criteo = new GeneralVehicle(csvLine, config, 'criteo');
			const criteoFields = {
				campanha: 'cpc:desktop_e_mobile',
				ad: 'Parâmetro(s) não encontrado(s) na configuração: Produto',
			};
			expect(JSON.stringify(criteo.buildedLine().values)).to.equal(
				JSON.stringify(criteoFields)
			);
		});
	});
	describe('Valida a geração da linha do GeneralVehicle para GA com dependência de campos', () => {
		it('Validar a geração de uma linha para o GA com todos Parâmetros corretos', () => {
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
				analyticsTools: {
					ga: {
						utm_source: ['Tipo de Compra', 'Dispositivo'],
						utm_campaign: ['Produto'],
					}
				},
				mediaTaxonomy: {
					criteo: {
						campanha: ['Tipo de Compra', 'Dispositivo'],
						ad: ['Produto'],
					}
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc', 'cpa'],
						hasMatch: false,
						columnDestiny: 'Produto',
						matches: ['fif'],
					},
				],
			});
			const criteo = new GeneralVehicle(csvLine, config, 'criteo');
			let criteoFields = {
				campanha: 'cpc:desktop_e_mobile',
				ad: 'fifinha',
			};
			expect(JSON.stringify(criteo.buildedLine().values)).to.equal(
				JSON.stringify(criteoFields)
			);
		});
		it('Validar a geração de uma linha para o GA com Parâmetros incorretos', () => {
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
				analyticsTools: {
					ga: {
						utm_source: ['Tipo de Compra', 'Dispositivo'],
						utm_campaign: ['Produto'],
					}
				},
				mediaTaxonomy: {
					criteo: {
						campanha: ['Tipo de Compra', 'Dispositivo'],
						ad: ['Produto'],
					}
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc', 'cpa'],
						hasMatch: true,
						columnDestiny: 'Produto',
						matches: ['fif'],
					},
					{
						columnReference: 'Dispositivo',
						valuesReference: ['/.*mobile.*/'],
						hasMatch: true,
						columnDestiny: 'Tipo de Compra',
						matches: ['cpc', 'cpa'],
					},
				],
			});
			const criteo = new GeneralVehicle(csvLine, config, 'criteo');
			const criteoFields = {
				campanha: 'cpc:desktop_e_mobile',
				ad: 'Parâmetro(s) incorreto(s): Produto',
			};
			expect(JSON.stringify(criteo.buildedLine().values)).to.equal(
				JSON.stringify(criteoFields)
			);
		});
	});
});
