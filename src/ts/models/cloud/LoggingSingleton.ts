import { Log } from '../Log';
import * as bunyan from 'bunyan';
import { LoggingBunyan } from '@google-cloud/logging-bunyan';

export class LoggingSingleton extends Log {
	private _loggingBunyan = new LoggingBunyan();
	private _loggerName = 'adinfo';
	private _infoInstance: bunyan;
	private _errorInstance: bunyan;
	private _warningInstance: bunyan;
	private static _instance: LoggingSingleton;

	private constructor() {
		super();
		this._infoInstance = bunyan.createLogger({
			name: this._loggerName,
			streams: [{ stream: process.stdout, level: 'info' }, this._loggingBunyan.stream('info')],
		});
		this._errorInstance = bunyan.createLogger({
			name: this._loggerName,
			streams: [{ stream: process.stdout, level: 'error' }, this._loggingBunyan.stream('error')],
		});
		this._warningInstance = bunyan.createLogger({
			name: this._loggerName,
			streams: [{ stream: process.stdout, level: 'warn' }, this._loggingBunyan.stream('warn')],
		});
	}

	/**
	 * Pega a instância ativa do logging
	 * @returns retorna a instância do Logging
	 */
	public static getInstance(): LoggingSingleton {
		if (!LoggingSingleton._instance) {
			LoggingSingleton._instance = new LoggingSingleton();
		}
		return LoggingSingleton._instance;
	}

	/**
	 * Escreve o log de uma mensagem com o status INFO
	 * @param message Mensagem a ser escrita no log
	 */
	public logInfo(message: string): void {
		if (process.env.ENV === 'development') {
			console.info(message);
		} else {
			this._infoInstance.info(message);
		}
	}

	/**
	 * Escreve o log de uma mensagem com o status ERROR
	 * @param message Mensagem a ser escrita no log
	 */
	public logError(message: string): void {
		if (process.env.ENV === 'development') {
			console.error(message);
		} else {
			this._errorInstance.error(message);
		}
	}

	/**
	 * Escreve o log de uma mensagem com o status WARNING
	 * @param message Mensagem a ser escrita no log
	 */
	public logWarning(message: string): void {
		if (process.env.ENV === 'development') {
			console.warn(message);
		} else {
			this._warningInstance.warn(message);
		}
	}
}
