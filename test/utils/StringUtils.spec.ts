import { expect } from 'chai';
import { StringUtils } from '../../src/ts/utils/StringUtils';

describe('String Utils', () => {
	describe('Normalize', () => {
		it('Normalização de String', () => {
			expect(StringUtils.normalize('Veículos')).to.equal('veiculos');
		});
		it('Normalização de String com espaços', () => {
			expect(StringUtils.normalize('ÀÃãáÇ ÈéÊÌíÒóõ')).to.equal(
				'aaaac eeeiiooo'
			);
		});
		it('Normalização de string com espaço e caracteres especiais', () => {
			expect(StringUtils.normalize('(&459082)èÓIÒ õÔÊIÔï')).to.equal(
				'(&459082)eoio ooeioi'
			);
		});
	});
	describe('Replace White Space', () => {
		it('Substituir o espaço em branco pelo caracter passado', () => {
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
		it('Valida se a string informada corresponde a string pasada', () => {
			expect(
				StringUtils.validateString('Hello World', ['Hello World'])
			).to.equal(true);
		});
		it('Valida se a string informada e sanitizada corresponde a alguma das strings passadas não sanitizadas', () => {
			expect(
				StringUtils.validateString('leo burnet', ['Oi', 'Leo Burnet'])
			).to.equal(true);
		});
		it('Valida se a string passada corresponde a regex informada', () => {
			expect(
				StringUtils.validateString('200x550 ', ['/\\d{3}x\\d{3}/'])
			).to.equal(true);
			expect(
				StringUtils.validateString('meuProduto ', ['/meuProdut[ai]/'])
			).to.equal(false);
		});
	});
	describe('Is Empty', () => {
		it('Valida se a string é vazia', () => {
			expect(StringUtils.isEmpty('')).to.equal(true);
			expect(StringUtils.isEmpty('teste')).to.equal(false);
		});
	});
});
