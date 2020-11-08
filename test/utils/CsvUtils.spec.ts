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

	describe('Config to CSV', () => {
		it('Trasnforma um JsonConfig do GA em um cabeçalho de CSV', () => {
			const jsonConfigGa = {
				separator: ':',
				spaceSeparator: '+',
				ga: {
					utm_source: {
						Veículo: [
							'google_ads',
							'facebook',
							'verizon',
							'globo',
							'afilio',
						],
					},
					utm_medium: {
						Inserção: [
							'CPC',
							'feed',
							'story',
							'native ads',
							'afiliado',
						],
					},
					utm_campaign: {
						campanha: [
							'fifinha-na-copa',
							'fifinha na copa da emoção',
						],
					},
					utm_content: {
						categoriaDoProduto: ['videogame', 'game'],
						produto: ['FIFA', 'PÉS', 'ronaldinho soccer 64'],
						segmentação: ['fifeiros', 'nao_fifeiros', 'smasheiros'],
						criativo: [
							'FIFA20',
							'PÉS20',
							'smash',
							'amiibo',
							'takeshi',
							'pikachi',
							'kakachi',
						],
						formato: ['darkpost', '/\\d{3}x\\d{3}/'],
					},
					utm_term: {
						campaignId: ['/\\d/'],
						adId: ['/\\d/'],
					},
				},
			};
			expect(CsvUtils.config2csvHeader(jsonConfigGa, ';')).to.equal(
				'Url;Veículo;Inserção;campanha;categoriaDoProduto;produto;segmentação;criativo;formato;campaignId;adId'
			);
		});
		it('Trasnforma um JsonConfig de Adobe em um cabeçalho de CSV', () => {
			const jsonConfigAdobe = {
				separator: ':',
				spaceSeparator: '+',
				adobe: {
					cid: {
						Veículo: [
							'google_ads',
							'facebook',
							'verizon',
							'globo',
							'afilio',
						],
						Inserção: [
							'CPC',
							'feed',
							'story',
							'native ads',
							'afiliado',
						],
						campanha: [
							'fifinha-na-copa',
							'fifinha na copa da emoção',
						],
						categoriaDoProduto: ['videogame', 'game'],
						produto: ['FIFA', 'PÉS', 'ronaldinho soccer 64'],
						segmentação: ['fifeiros', 'nao_fifeiros', 'smasheiros'],
						criativo: [
							'FIFA20',
							'PÉS20',
							'smash',
							'amiibo',
							'takeshi',
							'pikachi',
							'kakachi',
						],
						formato: ['darkpost', '/\\d{3}x\\d{3}/'],
						campaignId: ['/\\d/'],
						adId: ['/\\d/'],
					},
				},
			};
			expect(CsvUtils.config2csvHeader(jsonConfigAdobe, ';')).to.equal(
				'Url;Veículo;Inserção;campanha;categoriaDoProduto;produto;segmentação;criativo;formato;campaignId;adId'
			);
		});
		it('Trasnforma um JsonConfig de Adobe e GA em um cabeçalho CSV de GA', () => {
			const jsonConfigAdobeAndGa = {
				separator: ':',
				spaceSeparator: '+',
				ga: {
					utm_source: {
						Veículo: [
							'google_ads',
							'facebook',
							'verizon',
							'globo',
							'afilio',
						],
					},
					utm_medium: {
						Inserção: [
							'CPC',
							'feed',
							'story',
							'native ads',
							'afiliado',
						],
					},
				},
				adobe: {
					cid: {
						formato: ['darkpost', '/\\d{3}x\\d{3}/'],
						campaignId: ['/\\d/'],
						adId: ['/\\d/'],
					},
				},
			};
			expect(
				CsvUtils.config2csvHeader(jsonConfigAdobeAndGa, ';')
			).to.equal('Url;Veículo;Inserção');
		});
		it('Transforma um JsonConfi sem Adobe e GA em um cabeçalho CSV', () => {
			const jsonConfig = {
				separator: ':',
				spaceSeparator: '+',
				facebook: {
					dynamicValues: true,
					utm_source: '{{campaign.name}}',
					utm_term: '{{ad.name}}',
					utm_medium: '{{campaign.name}}|{{ad.name}}',
				},
			};
			expect(CsvUtils.config2csvHeader(jsonConfig, ';')).to.equal('Url');
		});
	});
});
