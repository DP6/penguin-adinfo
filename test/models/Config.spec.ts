import { expect } from 'chai';
import { Config } from '../../src/ts/models/Config';

describe('Config', () => {
	describe('Valida a criação do config para Adobe', () => {
		it('Validação do método toJson', () => {
			const jsonConfig = {
				separator: ':',
				csvSeparator: ',',
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc', 'cpa'],
						hasMatch: true,
						columnDestiny: 'Produto',
						matches: ['fif'],
					},
					{
						columnReference: 'Dispositivo',
						valuesReference: ['/.*mobile.*/'],
						hasMatch: true,
						columnDestiny: 'Tipo de Compra',
						matches: ['cpc', 'cpa'],
					},
				],
				spaceSeparator: '+',
				adobe: {
					cid: [
						'Veículo',
						'Inserção',
						'campanha',
						'categoriaDoProduto',
						'produto',
						'segmentação',
						'criativo',
						'formato',
						'campaignId',
						'adId',
					],
				},
				columns: {
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
					campanha: ['fifinha-na-copa', 'fifinha na copa da emoção'],
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
			};
			const config = new Config(jsonConfig);
			expect(JSON.stringify(config.toJson())).to.equal(
				JSON.stringify(jsonConfig)
			);
		});
		it('Validação do método toString', () => {
			const jsonConfig = {
				separator: ':',
				csvSeparator: ',',
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc', 'cpa'],
						hasMatch: true,
						columnDestiny: 'Produto',
						matches: ['fif'],
					},
					{
						columnReference: 'Dispositivo',
						valuesReference: ['/.*mobile.*/'],
						hasMatch: true,
						columnDestiny: 'Tipo de Compra',
						matches: ['cpc', 'cpa'],
					},
				],
				spaceSeparator: '+',
				adobe: {
					cid: [
						'Veículo',
						'Inserção',
						'campanha',
						'categoriaDoProduto',
						'produto',
						'segmentação',
						'criativo',
						'formato',
						'campaignId',
						'adId',
					],
				},
				columns: {
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
					campanha: ['fifinha-na-copa', 'fifinha na copa da emoção'],
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
			};
			const config = new Config(jsonConfig);
			expect(config.toString()).to.equal(JSON.stringify(jsonConfig));
		});
		it('Validação do método toCsvTemplate', () => {
			const jsonConfig = {
				csvSeparator: ',',
				separator: ':',
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc', 'cpa'],
						hasMatch: true,
						columnDestiny: 'Produto',
						matches: ['fif'],
					},
					{
						columnReference: 'Dispositivo',
						valuesReference: ['/.*mobile.*/'],
						hasMatch: true,
						columnDestiny: 'Tipo de Compra',
						matches: ['cpc', 'cpa'],
					},
				],
				spaceSeparator: '+',
				columns: {
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
					campanha: ['fifinha-na-copa', 'fifinha na copa da emoção'],
					categoriaDoProduto: ['videogame', 'game'],
				},
				adobe: {
					cid: [
						'Veículo',
						'Inserção',
						'campanha',
						'categoriaDoProduto',
					],
				},
			};
			const config = new Config(jsonConfig);
			expect(config.toCsvTemplate()).to.equal(
				'Url,Veículo,Inserção,campanha,categoriaDoProduto'
			);
		});
		it('Validação da geração das regras de validação', () => {
			const jsonConfig = {
				separator: ':',
				csvSeparator: ',',
				spaceSeparator: '+',
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc', 'cpa'],
						hasMatch: true,
						columnDestiny: 'Produto',
						matches: ['fif'],
					},
					{
						columnReference: 'Dispositivo',
						valuesReference: ['/.*mobile.*/'],
						hasMatch: true,
						columnDestiny: 'Tipo de Compra',
						matches: ['cpc', 'cpa'],
					},
				],
				adobe: {
					cid: [
						'Veículo',
						'Inserção',
						'campanha',
						'categoriaDoProduto',
					],
				},
				columns: {
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
					campanha: ['fifinha-na-copa', 'fifinha na copa da emoção'],
					categoriaDoProduto: ['videogame', 'game'],
				},
			};
			const config = new Config(jsonConfig);
			expect(JSON.stringify(config.validationRules)).to.equal(
				JSON.stringify(jsonConfig.columns)
			);
		});
	});
	describe('Valida a criação do config para GA', () => {
		it('Validação do método toJson', () => {
			const jsonConfig = {
				separator: ':',
				csvSeparator: ',',
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc', 'cpa'],
						hasMatch: true,
						columnDestiny: 'Produto',
						matches: ['fif'],
					},
					{
						columnReference: 'Dispositivo',
						valuesReference: ['/.*mobile.*/'],
						hasMatch: true,
						columnDestiny: 'Tipo de Compra',
						matches: ['cpc', 'cpa'],
					},
				],
				spaceSeparator: '+',
				ga: {
					utm_source: ['Veículo', 'Inserção'],
					utm_campaign: ['campanha', 'categoriaDoProduto'],
				},
				columns: {
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
					campanha: ['fifinha-na-copa', 'fifinha na copa da emoção'],
					categoriaDoProduto: ['videogame', 'game'],
				},
			};
			const config = new Config(jsonConfig);
			expect(JSON.stringify(config.toJson())).to.equal(
				JSON.stringify(jsonConfig)
			);
		});
		it('Validação do método toString', () => {
			const jsonConfig = {
				separator: ':',
				csvSeparator: ',',
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc', 'cpa'],
						hasMatch: true,
						columnDestiny: 'Produto',
						matches: ['fif'],
					},
					{
						columnReference: 'Dispositivo',
						valuesReference: ['/.*mobile.*/'],
						hasMatch: true,
						columnDestiny: 'Tipo de Compra',
						matches: ['cpc', 'cpa'],
					},
				],
				spaceSeparator: '+',
				ga: {
					utm_source: ['Veículo', 'Inserção'],
					utm_campaign: ['campanha', 'categoriaDoProduto'],
				},
				columns: {
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
					campanha: ['fifinha-na-copa', 'fifinha na copa da emoção'],
					categoriaDoProduto: ['videogame', 'game'],
				},
			};
			const config = new Config(jsonConfig);
			expect(config.toString()).to.equal(JSON.stringify(jsonConfig));
		});
		it('Validação do método toCsvTemplate', () => {
			const jsonConfig = {
				csvSeparator: ',',
				separator: ':',
				spaceSeparator: '+',
				columns: {
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
					campanha: ['fifinha-na-copa', 'fifinha na copa da emoção'],
					categoriaDoProduto: ['videogame', 'game'],
				},
				ga: {
					utm_source: ['Veículo', 'Inserção'],
					utm_campaign: ['campanha', 'categoriaDoProduto'],
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc', 'cpa'],
						hasMatch: true,
						columnDestiny: 'Produto',
						matches: ['fif'],
					},
					{
						columnReference: 'Dispositivo',
						valuesReference: ['/.*mobile.*/'],
						hasMatch: true,
						columnDestiny: 'Tipo de Compra',
						matches: ['cpc', 'cpa'],
					},
				],
			};
			const config = new Config(jsonConfig);
			expect(config.toCsvTemplate()).to.equal(
				'Url,Veículo,Inserção,campanha,categoriaDoProduto'
			);
		});
		it('Validação da geração das regras de validação', () => {
			const jsonConfig = {
				csvSeparator: ',',
				separator: ':',
				spaceSeparator: '+',
				columns: {
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
					campanha: ['fifinha-na-copa', 'fifinha na copa da emoção'],
					categoriaDoProduto: ['videogame', 'game'],
				},
				ga: {
					utm_source: ['Veículo', 'Inserção'],
					utm_campaign: ['campanha', 'categoriaDoProduto'],
				},
				dependenciesConfig: [
					{
						columnReference: 'Tipo de Compra',
						valuesReference: ['cpc', 'cpa'],
						hasMatch: true,
						columnDestiny: 'Produto',
						matches: ['fif'],
					},
					{
						columnReference: 'Dispositivo',
						valuesReference: ['/.*mobile.*/'],
						hasMatch: true,
						columnDestiny: 'Tipo de Compra',
						matches: ['cpc', 'cpa'],
					},
				],
			};
			const config = new Config(jsonConfig);
			expect(JSON.stringify(config.validationRules)).to.equal(
				JSON.stringify({
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
					campanha: ['fifinha-na-copa', 'fifinha na copa da emoção'],
					categoriaDoProduto: ['videogame', 'game'],
				})
			);
		});
	});
});
