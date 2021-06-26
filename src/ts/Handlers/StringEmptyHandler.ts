import { StringUtils } from '../utils/StringUtils';
import { AbstractHandler } from './AbstractHandler';
import { StringEmptyError } from '../Errors/StringEmptyError';

export class StringEmptyHandler extends AbstractHandler {
	/**
	 * Verifica se a string passada é vazia
	 * @param request String a ser validada
	 * @returns Em caso de falha, aciona um erro, em caso de acerto, passa para o proximo handler
	 */
	public handle(request: string): boolean {
		if (StringUtils.isEmpty(request)) {
			throw new StringEmptyError(`String vazia detectada!`);
		}
		return super.handle(request);
	}
}
