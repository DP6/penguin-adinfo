import { Handler } from './Handler';

export abstract class AbstractHandler implements Handler {
	private nextHandler: Handler;

	/**
	 * Seta o proximo Handler da cadeia de responsabilidade
	 * @param handler Proximo Handler da cadeia
	 * @returns Proximo Handler da cadeia
	 */
	public setNext(handler: Handler): Handler {
		this.nextHandler = handler;
		return handler;
	}

	/**
	 * Aplica a lógica de negócio do handler atual
	 * @param request parâmetro a ser passado entre os handlers
	 * @returns booleano correspondente a verificação feita nos handlers
	 */
	public handle(request: string): boolean {
		if (this.nextHandler) {
			return this.nextHandler.handle(request);
		}
		return true;
	}
}
