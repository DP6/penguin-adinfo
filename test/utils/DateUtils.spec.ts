import { expect } from 'chai';
import { DateUtils } from '../../src/ts/utils/DateUtils';

describe('Date Utils', () => {
	describe('New Date String Format', () => {
		it('Valida a alteração no formato da string de data', () => {
			expect(
				DateUtils.newDateStringFormat(
					'07/08/2019',
					'dd/mm/yyyy',
					'yyyymm'
				)
			).to.equal('201908');
			expect(
				DateUtils.newDateStringFormat(
					'2020-02-01',
					'yyyy-mm-dd',
					'dd/mm/yyyy'
				)
			).to.equal('01/02/2020');
			expect(
				DateUtils.newDateStringFormat(
					'20200201',
					'yyyymmdd',
					'dd/mm/yyyy'
				)
			).to.equal('01/02/2020');
			expect(
				DateUtils.newDateStringFormat(
					'20200201',
					'yyyymmdd',
					'dd/mm/yyyy'
				)
			).to.equal('01/02/2020');
		});
		it('Valida a alteração no formato da string de data com horas', () => {
			expect(
				DateUtils.newDateStringFormat(
					'20200819184820',
					'yyyymmddhhMMss',
					'hh:MM:ss dd/mm/yyyy'
				)
			).to.equal('18:48:20 19/08/2020');
		});
	});
	describe('Generate Date String', () => {
		it('Valida a geração da string de data sem os segundos', () => {
			const date = new Date();
			expect(DateUtils.generateDateString()).to.equal(
				date.getFullYear() +
					'' +
					('0' + String(date.getMonth() + 1)).slice(-2) +
					'' +
					('0' + String(date.getDate())).slice(-2) +
					'' +
					('0' + String(date.getHours())).slice(-2) +
					'' +
					('0' + String(date.getMinutes())).slice(-2)
			);
		});
		it('Valida a geração da string de data com os segundos', () => {
			const date = new Date();
			expect(DateUtils.generateDateString(true)).to.equal(
				date.getFullYear() +
					'' +
					('0' + String(date.getMonth() + 1)).slice(-2) +
					'' +
					('0' + String(date.getDate())).slice(-2) +
					'' +
					('0' + String(date.getHours())).slice(-2) +
					'' +
					('0' + String(date.getMinutes())).slice(-2) +
					'' +
					('0' + String(date.getSeconds())).slice(-2)
			);
		});
	});
});
