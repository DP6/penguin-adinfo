import { expect } from 'chai';
import { CsvUtils } from '../../src/ts/utils/CsvUtils';

describe('CSV Utils', () => {
	describe('CSV to JSON', () => {
		it('Transforma CSV preenchido corretamente em Json', () => {
			const csvContent = `
            Nome,Idade,Sexo
            Rodrigo,25,Masculino
            Juan,45,Masculino
            Larissa,12,Feminino
            Julia,78,Feminino
            `;
			const jsonFromCsv = [
				{
					Nome: 'Rodrigo',
					Idade: '25',
					Sexo: 'Masculino',
				},
				{
					Nome: 'Juan',
					Idade: '45',
					Sexo: 'Masculino',
				},
				{
					Nome: 'Larissa',
					Idade: '12',
					Sexo: 'Feminino',
				},
				{
					Nome: 'Julia',
					Idade: '78',
					Sexo: 'Feminino',
				},
			];
			expect(JSON.stringify(CsvUtils.csv2json(csvContent, ','))).to.equal(
				JSON.stringify(jsonFromCsv)
			);
		});
		it('Transforma um CSV preenchido com espaços em JSON', () => {
			const csvContent = `
            Nome,Idade,Sexo
            Rodrigo,   25    ,Masculino
            Juan       ,45,       Masculino
            `;
			const jsonFromCsv = [
				{
					Nome: 'Rodrigo',
					Idade: '25',
					Sexo: 'Masculino',
				},
				{
					Nome: 'Juan',
					Idade: '45',
					Sexo: 'Masculino',
				},
			];
			expect(JSON.stringify(CsvUtils.csv2json(csvContent, ','))).to.equal(
				JSON.stringify(jsonFromCsv)
			);
		});
		it('Transforma um CSV somente com preenchimento de cabeçalhos em JSON', () => {
			const csvContent = `
            Nome,Idade,Sexo
            `;
			expect(JSON.stringify(CsvUtils.csv2json(csvContent, ','))).to.equal(
				'[]'
			);
		});
		it('Transforma um CSV com alguns preenchimentos vazios em JSON', () => {
			const csvContent = `
            Nome,Idade,Sexo
            Rodrigo,       ,Masculino
            Juan       ,45,       
            `;
			const jsonFromCsv = [
				{
					Nome: 'Rodrigo',
					Idade: '',
					Sexo: 'Masculino',
				},
				{
					Nome: 'Juan',
					Idade: '45',
					Sexo: '',
				},
			];
			expect(JSON.stringify(CsvUtils.csv2json(csvContent, ','))).to.equal(
				JSON.stringify(jsonFromCsv)
			);
		});
		it('Transforma um CSV vazio em JSON', () => {
			const csvContent = '';
			expect(JSON.stringify(CsvUtils.csv2json(csvContent, ','))).to.equal(
				'[]'
			);
		});
	});
	describe('Is Line Empty', () => {
		it('Verifica se a linha passada está vazia', () => {
			const csvLine = {
				c1: 'valor1',
				c2: 'valor2',
				c3: '',
				c4: 'valor4',
			};
			expect(CsvUtils.isLineEmpty(csvLine)).to.equal(false);
			csvLine.c1 = '';
			csvLine.c2 = '';
			csvLine.c4 = '';
			expect(CsvUtils.isLineEmpty(csvLine)).to.equal(true);
		});
	});
});
