import { expect } from 'chai';
import { ApiResponse } from '../../src/ts/models/ApiResponse';

describe('ApiResponse', () => {
	describe('Valida a geração da resposta da API', () => {
		it('Validar a geração do JSON de resposta da API', () => {
			const apiResponse = new ApiResponse(200, 'Mensagem Teste', 'Mensagem Erro');
			expect(JSON.stringify(apiResponse.jsonResponse)).to.equal(
				JSON.stringify({
                    responseText: 'Mensagem Teste',
                    errorMessage: 'Mensagem Erro'
                })
			);
		});
		it('Validar o status code da resposta da API', () => {
			const apiResponse = new ApiResponse(400, 'Mensagem Teste', 'Mensagem Erro');
			expect(apiResponse.statusCode).to.equal(400);
		});
	});
});
