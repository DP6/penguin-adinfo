import { Log } from '../Log';
// import * as credentials from '../../config/gcp_key.json';
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

	public static getInstance(): LoggingSingleton {
		if (!LoggingSingleton._instance) {
			LoggingSingleton._instance = new LoggingSingleton();
		}
		return LoggingSingleton._instance;
	}

	public logInfo(message: string): void {
		if (process.env.ENV === 'development') {
			console.info(message);
		} else {
			this._infoInstance.info(message);
		}
	}

	public logError(message: string): void {
		if (process.env.ENV === 'development') {
			console.error(message);
		} else {
			this._errorInstance.error(message);
		}
	}

	public logWarning(message: string): void {
		if (process.env.ENV === 'development') {
			console.warn(message);
		} else {
			this._warningInstance.warn(message);
		}
	}
}
