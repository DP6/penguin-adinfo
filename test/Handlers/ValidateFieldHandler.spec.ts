import { expect } from 'chai';
import { Config } from '../../src/ts/models/Config';
import { ValidateFieldHandler } from '../../src/ts/Handlers/ValidateFieldHandler'

describe('ValidateFieldHandler', () => {
	describe('Valida o Handler ValidateField', () => {
		it('Validação caso o preenchimento esteja incorreto', () => {
            const csvLine = {
				Url: 'www.teste.com.br',
				'tipo de compra': 'cpb',
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
			});
			const field = new ValidateFieldHandler(config, 'Tipo de Compra');
            let errorName: string;
            try {
                field.handle(csvLine['tipo de compra']);
            } catch(e) {
                errorName = e.name;
            }
			expect(errorName).to.equal('ValidateFieldError');
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
			});
			const field = new ValidateFieldHandler(config, 'Tipo de Compra');
            let result: boolean;
            let errorName: string;
            try {
                result = field.handle(csvLine['tipo de compra']);
            } catch(e) {
                errorName = e.name;
            }
			expect(result).to.equal(true);
		});
	});
});
