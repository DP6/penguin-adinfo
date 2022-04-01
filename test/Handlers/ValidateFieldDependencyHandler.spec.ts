import { expect } from 'chai';
import { Config } from '../../src/ts/models/Config';
import { ValidateFieldDependencyHandler } from '../../src/ts/Handlers/ValidateFieldDependencyHandler'

describe('ValidateFieldDependencyHandler', () => {
	describe('Valida o Handler ValidateFieldDependency', () => {
		it('Validação caso o preenchimento esteja incorreto', () => {
            const csvLine = {
				Url: 'www.teste.com.br',
				'tipo de compra': 'cpc',
				dispositivo: 'mobile',
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
				analyticsTools: {
					adobe: {
						cid: ['Tipo de Compra', 'Dispositivo', 'Veículo'],
					},
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
			const fieldDependency = new ValidateFieldDependencyHandler(config, csvLine, 'Dispositivo');
            let errorName: string;
            try {
                fieldDependency.handle(csvLine['dispositivo']);
            } catch(e) {
                errorName = e.name;
            }
			expect(errorName).to.equal('ValidateFieldDependencyError');
		});
		it('Validação caso o preenchimento esteja correto', () => {
            const csvLine = {
				Url: 'www.teste.com.br',
				'tipo de compra': 'cpc',
				dispositivo: 'desktop',
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
				analyticsTools: {
					adobe: {
						cid: ['Tipo de Compra', 'Dispositivo', 'Veículo'],
					},
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
			const fieldDependency = new ValidateFieldDependencyHandler(config, csvLine, 'Dispositivo');
            let result: boolean;
            let errorName: string;
            try {
                result = fieldDependency.handle(csvLine['dispositivo']);
            } catch(e) {
                errorName = e.name;
            }
			expect(result).to.equal(true);
		});
	});
});
