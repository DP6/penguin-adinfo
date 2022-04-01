import { expect } from 'chai';
import { Config } from '../../src/ts/models/Config';
import { ValidateRulesForColumnHandler } from '../../src/ts/Handlers/ValidateRulesForColumnHandler'

describe('ValidateRulesForColumnHandler', () => {
	describe('Valida o Handler ValidateRulesForColumn', () => {
		it('Validação caso a coluna não possua nenhuma regra de validação', () => {
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
			});
			const rules = new ValidateRulesForColumnHandler(config, 'dispositivo');
            let errorName: string;
            try {
                rules.handle();
            } catch(e) {
                errorName = e.name;
            }
			expect(errorName).to.equal('ValidateRulesForColumnError');
		});
		it('Validação caso a coluna possua regra de validação', () => {
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
			});
			const rules = new ValidateRulesForColumnHandler(config, 'Tipo de Compra');
            let result: boolean;
            let errorName: string;
            try {
                result = rules.handle();
            } catch(e) {
                errorName = e.name;
            }
			expect(result).to.equal(true);
		});
	});
});
