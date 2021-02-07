import { Parametrizer } from './Parametrizer';

export abstract class AnalyticsTool extends Parametrizer {
	protected _url: string;

	get url(): string {
		return this._url;
	}

	set url(url: string) {
		this._url = url;
	}

	/**
	 * Método para construção de URLs
	 */
	protected abstract _buildUrl(): string;
}
