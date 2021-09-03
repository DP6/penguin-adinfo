import { LoggingSingleton } from './cloud/LoggingSingleton';

export class ApiResponse {
	private _statusCode: number;
	private _responseText: string;
	private _errorMessage: string;

	constructor(statusCode = 200, responseText = '', errorMessage = '') {
		this._statusCode = statusCode;
		this._responseText = responseText;
		this._errorMessage = errorMessage;
	}

	set errorMessage(errorMessage: string) {
		this._errorMessage = errorMessage;
	}

	get statusCode(): number {
		return this._statusCode;
	}

	set statusCode(statusCode: number) {
		this._statusCode = statusCode;
	}

	get responseText(): string {
		return this._responseText;
	}

	set responseText(responseText: string) {
		this._responseText = responseText;
	}

	/**
	 * Retorna um JSON corresponde à resposta padrão da API
	 */
	get jsonResponse(): { [key: string]: string } {
		const response = {
			responseText: this._responseText,
			errorMessage: this._errorMessage,
		};
		if (this._statusCode !== 200) {
			LoggingSingleton.getInstance().logError(JSON.stringify(response));
		}
		return response;
	}
}
