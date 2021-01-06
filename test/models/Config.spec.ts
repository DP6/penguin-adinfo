import { json } from 'body-parser';
import { expect } from 'chai';
import { Config } from '../../src/ts/models/Config';

describe('Config', () => {
	describe('Valida a criação do config para Adobe', () => {
		it('Validação do método toJson', () => {
			const jsonConfig = {
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
			const config = new Config(jsonConfig);
			expect(JSON.stringify(config.toJson())).to.equal(
				JSON.stringify(jsonConfig)
			);
		});
		it('Validação do método toString', () => {
			const jsonConfig = {
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
			const config = new Config(jsonConfig);
			expect(config.toString()).to.equal(JSON.stringify(jsonConfig));
		});
		it('Validação do método toCsvTemplate', () => {
			const jsonConfig = {
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
					},
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
					},
				},
			};
			const config = new Config(jsonConfig);
			expect(JSON.stringify(config.validationRules)).to.equal(
				JSON.stringify(jsonConfig.adobe.cid)
			);
		});
	});
	describe('Valida a criação do config para GA', () => {
		it('Validação do método toJson', () => {
			const jsonConfig = {
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
						categoriaDoProduto: ['videogame', 'game'],
					},
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
						categoriaDoProduto: ['videogame', 'game'],
					},
				},
			};
			const config = new Config(jsonConfig);
			expect(config.toString()).to.equal(JSON.stringify(jsonConfig));
		});
		it('Validação do método toCsvTemplate', () => {
			const jsonConfig = {
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
						categoriaDoProduto: ['videogame', 'game'],
					},
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
						categoriaDoProduto: ['videogame', 'game'],
					},
				},
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
