import { expect } from 'chai';
import { JsonUtils } from '../../src/ts/utils/JsonUtils';

describe('Json Utils', () => {
	describe('Normalize Keys', () => {
		it('Normalização das chaves nivel 1', () => {
			const jsonForFormat: { [key: string]: any } = {
				Óòlá: 1,
				Téstê: 2,
				conceiÇÃo: 3,
				ÂëÌi: 4,
			};
			const jsonFormated: { [key: string]: any } = {
				oola: 1,
				teste: 2,
				conceicao: 3,
				aeii: 4,
			};
			expect(
				JSON.stringify(JsonUtils.normalizeKeys(jsonForFormat))
			).to.equal(JSON.stringify(jsonFormated));
		});
		it('Normalização das chaves nivel 2', () => {
			const jsonForFormat: { [key: string]: any } = {
				Óòlá: 1,
				Téstê: 2,
				conceiÇÃo: 3,
				ÂëÌi: 4,
				olá: {
					óó: 1,
				},
			};
			const jsonFormated: { [key: string]: any } = {
				oola: 1,
				teste: 2,
				conceicao: 3,
				aeii: 4,
				ola: {
					oo: 1,
				},
			};
			expect(
				JSON.stringify(JsonUtils.normalizeKeys(jsonForFormat))
			).to.equal(JSON.stringify(jsonFormated));
		});
		it('Normalização das chaves nivel com array', () => {
			const jsonForFormat: { [key: string]: any } = {
				Óòlá: 1,
				Téstê: 2,
				conceiÇÃo: 3,
				ÂëÌi: 4,
				olá: {
					óó: 1,
				},
				Ar: ['ó', 'oOoó'],
			};
			const jsonFormated: { [key: string]: any } = {
				oola: 1,
				teste: 2,
				conceicao: 3,
				aeii: 4,
				ola: {
					oo: 1,
				},
				ar: ['ó', 'oOoó'],
			};
			expect(
				JSON.stringify(JsonUtils.normalizeKeys(jsonForFormat))
			).to.equal(JSON.stringify(jsonFormated));
		});
	});
	describe('Add Parameters At Json', () => {
		it('Add Keys at Json', () => {
			const date = new Date();
			const jsonBase = {
				chave1: 1,
				chave2: 2,
			};
			const addJson1 = {
				chave3: 3,
				chave4: 4,
			};
			const addJson2 = {
				ar1: [{ 1: 1, 2: 2 }],
				j1: {
					1: 1,
				},
				date: date,
			};
			const result = {
				chave1: 1,
				chave2: 2,
				chave3: 3,
				chave4: 4,
				ar1: [{ 1: 1, 2: 2 }],
				j1: {
					1: 1,
				},
				date: date,
			};
			expect(
				JSON.stringify(
					JsonUtils.addParametersAt(jsonBase, addJson1, addJson2)
				)
			).to.equal(JSON.stringify(result));
		});
	});
});
