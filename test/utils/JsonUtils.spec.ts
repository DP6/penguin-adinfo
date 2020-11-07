import { expect } from 'chai';
import { JsonUtils } from '../../src/ts/utils/JsonUtils';

describe('Json Utils', () => {
	describe('Normalize Json Keys', () => {
		it('Sanitize Json Keys', () => {
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
			Object.keys(jsonForFormat).map(
				(key) => (jsonForFormat[key] = { Ò: 1 })
			);
			Object.keys(jsonFormated).map(
				(key) => (jsonFormated[key] = { o: 1 })
			);
			expect(
				JSON.stringify(JsonUtils.normalizeKeys(jsonForFormat))
			).to.equal(JSON.stringify(jsonFormated));
		});
	});
	describe('Add Parameters At Json', () => {
		it('Add Keys at Json', () => {
			let jsonBase = {
				chave1: 1,
				chave2: 2,
			};
			let addJson1 = {
				chave3: 3,
				chave4: 4,
			};
			let addJson2 = {
				ar1: [{ 1: 1, 2: 2 }],
				j1: {
					1: 1,
				},
				date: new Date(),
			};
			let result = {
				chave1: 1,
				chave2: 2,
				chave3: 3,
				chave4: 4,
				ar1: [{ 1: 1, 2: 2 }],
				j1: {
					1: 1,
				},
				date: new Date(),
			};
			expect(
				JSON.stringify(
					JsonUtils.addParametersAt(jsonBase, addJson1, addJson2)
				)
			).to.equal(JSON.stringify(result));
		});
	});
});
