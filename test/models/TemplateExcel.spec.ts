import { expect } from 'chai';
import { TemplateExcel } from '../../src/ts/models/TemplateExcel';
import { Config } from '../../src/ts/models/Config';

describe('TemplateExcel', () => {
	const config = new Config({
		separator: ':',
		spaceSeparator: '_',
		columns: {
			'Tipo de Compra': ['cpa', 'cpc', '/cp./'],
			'Veiculo': ['/(?i)google/', '/(?i)facebook/'],
			'Produto': ['/.*/'],
			'Tipo de Midia': ['display', 'video', 'stories'],
		},
		adobe: {
			cid: ['Tipo de Compra', 'Produto', 'Tipo de Midia'],
		},
	});
	const templateExcel = new TemplateExcel(config);

	describe('Header configuration', () => {
		it('Header do campo de livre preenchimento', () => {
			expect(
				JSON.stringify(templateExcel.getHeaderConfig('Produto'))
			).to.equal(JSON.stringify({
				note: null,
				backgroundColor: templateExcel.headerColors.freeForm
			}));
		});
		it('Header do campo de preenchimento segundo regra de expressã o regular', () => {
			expect(
				JSON.stringify(templateExcel.getHeaderConfig('Tipo de Compra'))
			).to.equal(JSON.stringify({
				note: 'Regexp: /cp./',
				backgroundColor: templateExcel.headerColors.semiFreeForm}));
			expect(
				JSON.stringify(templateExcel.getHeaderConfig('Veiculo'))
			).to.equal(JSON.stringify({
				note: 'Regexp: /(?i)google/ ou /(?i)facebook/',
				backgroundColor: templateExcel.headerColors.semiFreeForm
			}));
		})
		it('Header do campo restrito à lista de valores pré-definidos na configuração', () => {
			expect(
				JSON.stringify(templateExcel.getHeaderConfig('Tipo de Midia'))
			).to.equal(JSON.stringify({
				note: null,
				backgroundColor: templateExcel.headerColors.restrictedForm
			}));
		})
	});

	describe('Configuração da cor de fundo', () => {
		it('Cor de fundo', () => {
			expect(
				JSON.stringify(templateExcel.getCellStyleFill('FFFFFFFF'))
			).to.equal(JSON.stringify({
				type: 'pattern',
				pattern: 'solid',
				fgColor: {
					argb: 'FFFFFFFF'
				}
			}))
		})
	})
});
