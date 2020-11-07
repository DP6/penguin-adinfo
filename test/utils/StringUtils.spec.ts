import { expect } from 'chai';
import { StringUtils } from '../../src/ts/utils/StringUtils';

describe('String Utils', () => {
	describe('Normalize String', () => {
		it('Replace special characters for comum characters in lowercase', () => {
			expect(StringUtils.normalize('Veículos')).to.equal('veiculos');
			expect(StringUtils.normalize('ÀÃãáÇ ÈéÊÌíÒóõ')).to.equal(
				'aaaac eeeiiooo'
			);
			expect(StringUtils.normalize('(&459082)èÓIÒ õÔÊIÔï')).to.equal(
				'(&459082)eoio ooeioi'
			);
		});
	});
	describe('Replace Withe Space', () => {
		it('Replace white space in string with specified character', () => {
			expect(StringUtils.replaceWhiteSpace('Hello World', '')).to.equal(
				'HelloWorld'
			);
			expect(StringUtils.replaceWhiteSpace('Hello World', '!')).to.equal(
				'Hello!World'
			);
			expect(StringUtils.replaceWhiteSpace('Hello World ', '!')).to.equal(
				'Hello!World!'
			);
		});
	});
	describe('Validate String', () => {
		it('Validates if a string follows the specified pattern', () => {
			expect(
				StringUtils.validateString('Hello World', ['HelloWorld'])
			).to.equal(false);
			expect(
				StringUtils.validateString('leo burnet', ['Oi', 'Leo Burnet'])
			).to.equal(true);
			expect(
				StringUtils.validateString('200x550 ', ['/\\d{3}x\\d{3}/'])
			).to.equal(true);
		});
	});
});
