import { StringUtils } from '../utils/StringUtils';
import { AbstractHandler } from './AbstractHandler';
import { StringEmptyError } from '../Errors/StringEmptyError';

export class StringEmptyHandler extends AbstractHandler {
	public handle(request: string): boolean {
		if (StringUtils.isEmpty(request)) {
			throw new StringEmptyError(`String vazia detectada!`);
		}
		return super.handle(request);
	}
}
