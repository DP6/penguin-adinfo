import { expect } from 'chai';
import { CsvUtils } from '../../src/ts/utils/CsvUtils';

describe('CSV Utils', () => {
	describe('CSV to JSON', () => {
		it('Transform CSV content in JSON', () => {
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
			const csvContent2 = `
            Nome,Idade,Sexo
            Rodrigo,   25    ,Masculino
            Juan       ,45,       Masculino
            `;
			const jsonFromCsv2 = [
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
			expect(
				JSON.stringify(CsvUtils.csv2json(csvContent2, ','))
			).to.equal(JSON.stringify(jsonFromCsv2));
			const csvContent3 = `
            Nome,Idade,Sexo
            `;
			expect(
				JSON.stringify(CsvUtils.csv2json(csvContent3, ','))
			).to.equal('[]');
			const csvContent4 = `
            Nome,Idade,Sexo
            Rodrigo,       ,Masculino
            Juan       ,45,       
            `;
			const jsonFromCsv4 = [
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
			expect(
				JSON.stringify(CsvUtils.csv2json(csvContent4, ','))
			).to.equal(JSON.stringify(jsonFromCsv4));
			const csvContent5 = '';
			expect(
				JSON.stringify(CsvUtils.csv2json(csvContent5, ','))
			).to.equal('[]');
		});
	});

	describe('Config to CSV', () => {
		it('Transform JSON config in CSV header content', () => {
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
