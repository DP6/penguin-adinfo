import { expect } from 'chai';
import { Builder } from '../../src/ts/controllers/Builder';
import { Config } from '../../src/ts/models/Config';

describe('Builder', () => {
	describe('Valida a geração do csv para Adobe', () => {
		it('Validação caso o cid esteja correto', () => {
			const csvLine = [
				{
					Url: 'www.teste.com.br',
					'Tipo de Compra': 'cpc',
					Dispositivo: 'desktop e mobile',
					Bandeira: 'meu Produto',
					Veículo: 'meuVeículo',
				},
			];
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Bandeira: [],
					Veículo: [],
				},
				adobe: {
					cid: ['Tipo de Compra', 'Bandeira', 'Veículo'],
				},
			});
			const builder = new Builder(csvLine, config, 'adobe');
			const abodeFields = [
				{
					Url: 'www.teste.com.br',
					'Tipo de Compra': 'cpc',
					Dispositivo: 'desktop e mobile',
					Bandeira: 'meu Produto',
					Veículo: 'meuVeículo',
					cid: 'cpc:meu_produto:meuveiculo',
					'url adobe':
						'www.teste.com.br?cid=cpc:meu_produto:meuveiculo',
				},
			];
			expect(JSON.stringify(builder.build())).to.equal(
				JSON.stringify(abodeFields)
			);
		});
	});
	describe('Valida a geração do csv para GA', () => {
		it('Validação caso os utms estejam corretos', () => {
			const csvLine = [
				{
					Url: 'www.teste.com.br',
					'Tipo de Compra': 'cpc',
					Dispositivo: 'desktop e mobile',
					Período: 'Maio 2020',
					Bandeira: 'Minha Bandeira',
				},
			];
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Período: ['/[a-zA-Z]* [0-9]{4}/'],
					Bandeira: [],
				},
				ga: {
					utm_medium: ['Tipo de Compra'],
					utm_campaign: ['Período', 'Bandeira'],
				},
			});
			const builder = new Builder(csvLine, config, 'ga');
			const gaFields = [
				{
					Url: 'www.teste.com.br',
					'Tipo de Compra': 'cpc',
					Dispositivo: 'desktop e mobile',
					Período: 'Maio 2020',
					Bandeira: 'Minha Bandeira',
					utms: {
						utm_medium: 'cpc',
						utm_campaign: 'maio_2020:minha_bandeira',
					},
					'url ga':
						'www.teste.com.br?utm_medium=cpc&utm_campaign=maio_2020:minha_bandeira',
				},
			];
			expect(JSON.stringify(builder.build())).to.equal(
				JSON.stringify(gaFields)
			);
		});
	});
	describe('Valida a geração do csv para Facebookads', () => {
		it('Validação do Facebookads para GA com parametros corretos', () => {
			const csvLine = [
				{
					Url: 'www.teste.com.br',
					'Tipo de Compra': 'cpc',
					Dispositivo: 'desktop e mobile',
					Período: 'Maio 2020',
					Bandeira: 'Minha Bandeira',
				},
			];
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Período: ['/[a-zA-Z]* [0-9]{4}/'],
					Bandeira: ['/.*/'],
				},
				ga: {
					utm_medium: ['Tipo de Compra'],
					utm_campaign: ['Período', 'Bandeira'],
				},
				facebookads: {
					'ad.name': ['Tipo de Compra', 'Bandeira'],
				},
			});
			const builder = new Builder(csvLine, config, 'facebookads');
			const facebookadsFields = [
				{
					Url: 'www.teste.com.br',
					'Tipo de Compra': 'cpc',
					Dispositivo: 'desktop e mobile',
					Período: 'Maio 2020',
					Bandeira: 'Minha Bandeira',
					'ad name': 'cpc:minha_bandeira',
					utms: {
						utm_medium: 'cpc',
						utm_campaign: 'maio_2020:minha_bandeira',
					},
					'url ga':
						'www.teste.com.br?utm_medium=cpc&utm_campaign=maio_2020:minha_bandeira',
				},
			];
			expect(JSON.stringify(builder.build())).to.equal(
				JSON.stringify(facebookadsFields)
			);
		});
		it('Validação do Facebookads para Adobe com parametros corretos', () => {
			const csvLine = [
				{
					Url: 'www.teste.com.br',
					'Tipo de Compra': 'cpc',
					Dispositivo: 'desktop e mobile',
					Bandeira: 'meu Produto',
					Veículo: 'meuVeículo',
				},
			];
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Bandeira: [],
					Veículo: [],
				},
				adobe: {
					cid: ['Tipo de Compra', 'Bandeira', 'Veículo'],
				},
				facebookads: {
					'ad.id': ['Tipo de Compra', 'Bandeira'],
				},
			});
			const builder = new Builder(csvLine, config, 'facebookads');
			const facebookadsFields = [
				{
					Url: 'www.teste.com.br',
					'Tipo de Compra': 'cpc',
					Dispositivo: 'desktop e mobile',
					Bandeira: 'meu Produto',
					Veículo: 'meuVeículo',
					'ad id': 'cpc:meu_produto',
					cid: 'cpc:meu_produto:meuveiculo',
					'url adobe':
						'www.teste.com.br?cid=cpc:meu_produto:meuveiculo',
				},
			];
			expect(JSON.stringify(builder.build())).to.equal(
				JSON.stringify(facebookadsFields)
			);
		});
	});
	describe('Valida a geração do csv para Googleads', () => {
		it('Validação do Googleads para GA com parametros corretos', () => {
			const csvLine = [
				{
					Url: 'www.teste.com.br',
					'Tipo de Compra': 'cpc',
					Dispositivo: 'desktop e mobile',
					Período: 'Maio 2020',
					Bandeira: 'Minha Bandeira',
				},
			];
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Período: ['/[a-zA-Z]* [0-9]{4}/'],
					Bandeira: ['/.*/'],
					Dispositivo: [],
				},
				ga: {
					utm_medium: ['Tipo de Compra'],
					utm_campaign: ['Período', 'Bandeira'],
				},
				googleads: {
					campanha: ['Tipo de Compra', 'Dispositivo'],
					ad: ['Bandeira'],
				},
			});
			const builder = new Builder(csvLine, config, 'googleads');
			const googleAds = [
				{
					Url: 'www.teste.com.br',
					'Tipo de Compra': 'cpc',
					Dispositivo: 'desktop e mobile',
					Período: 'Maio 2020',
					Bandeira: 'Minha Bandeira',
					campanha: 'cpc:desktop_e_mobile',
					ad: 'minha_bandeira',
					utms: {
						utm_medium: 'cpc',
						utm_campaign: 'maio_2020:minha_bandeira',
					},
					'url ga':
						'www.teste.com.br?utm_medium=cpc&utm_campaign=maio_2020:minha_bandeira',
				},
			];
			expect(JSON.stringify(builder.build())).to.equal(
				JSON.stringify(googleAds)
			);
		});
		it('Validação do GoogleAds para Adobe com parametros corretos', () => {
			const csvLine = [
				{
					Url: 'www.teste.com.br',
					'Tipo de Compra': 'cpc',
					Dispositivo: 'desktop e mobile',
					Bandeira: 'meu Produto',
					Veículo: 'meuVeículo',
				},
			];
			const config = new Config({
				separator: ':',
				spaceSeparator: '_',
				columns: {
					'Tipo de Compra': ['cpa', 'cpc'],
					Bandeira: [],
					Veículo: [],
					Dispositivo: [],
				},
				adobe: {
					cid: ['Tipo de Compra', 'Bandeira', 'Veículo'],
				},
				googleads: {
					campanha: ['Tipo de Compra', 'Dispositivo'],
					ad: ['Bandeira'],
				},
			});
			const builder = new Builder(csvLine, config, 'googleads');
			const googleAds = [
				{
					Url: 'www.teste.com.br',
					'Tipo de Compra': 'cpc',
					Dispositivo: 'desktop e mobile',
					Bandeira: 'meu Produto',
					Veículo: 'meuVeículo',
					campanha: 'cpc:desktop_e_mobile',
					ad: 'meu_produto',
					cid: 'cpc:meu_produto:meuveiculo',
					'url adobe':
						'www.teste.com.br?cid=cpc:meu_produto:meuveiculo',
				},
			];
			expect(JSON.stringify(builder.build())).to.equal(
				JSON.stringify(googleAds)
			);
		});
	});
});
