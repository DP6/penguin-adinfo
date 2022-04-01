import { expect } from 'chai';
import { Config } from '../../src/ts/models/Config';
import { ValidateColumnExistsHandler } from '../../src/ts/Handlers/ValidateColumnExistsHandler'

describe('ValidateColumnExistsHandler', () => {
	describe('Valida o Handler ValidateColumnExists', () => {
		it('Validação caso a coluna não exista', () => {
            const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Bandeira: [],
					Veículo: [],
				},
				analyticsTools: {
					adobe: {
						cid: ['Tipo de Compra', 'Bandeira', 'Veículo'],
					},
				}
			});
			const columnsExists = new ValidateColumnExistsHandler(config, 'Produto');
            let errorName: string;
            try {
                columnsExists.handle();
            } catch(e) {
                errorName = e.name;
            }
			expect(errorName).to.equal('ValidateColumnExistsError');
		});
		it('Validação caso a coluna exista', () => {
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Bandeira: [],
					Veículo: [],
				},
				analyticsTools: {
					adobe: {
						cid: ['Tipo de Compra', 'Bandeira', 'Veículo'],
					},
				},
			});
			const columnsExists = new ValidateColumnExistsHandler(config, 'Bandeira');
            let result: boolean;
            let errorName: string;
            try {
                result = columnsExists.handle();
            } catch(e) {
                errorName = e.name;
            }
			expect(result).to.equal(true);
		});
	});
});
