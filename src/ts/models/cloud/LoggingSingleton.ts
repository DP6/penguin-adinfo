import { Log } from '../Log';
// import * as credentials from '../../config/gcp_key.json';
import * as bunyan from 'bunyan';
import { LoggingBunyan } from '@google-cloud/logging-bunyan';

export class LoggingSingleton extends Log {
	private static _loggingBunyan = new LoggingBunyan();
	private static _loggerName = 'adinfo';
	private static _infoInstance: bunyan;
	private static _errorInstance: bunyan;
	private static _warningInstance: bunyan;

	private constructor() {
		super();
	}

	public static logInfo(message: string): void {
		if (!LoggingSingleton._infoInstance) {
			LoggingSingleton._infoInstance = bunyan.createLogger({
				name: LoggingSingleton._loggerName,
				streams: [{ stream: process.stdout, level: 'info' }, this._loggingBunyan.stream('info')],
			});
		}
		LoggingSingleton._infoInstance.info(message);
	}

	public static logError(message: string): void {
		if (!LoggingSingleton._errorInstance) {
			LoggingSingleton._errorInstance = bunyan.createLogger({
				name: LoggingSingleton._loggerName,
				streams: [{ stream: process.stdout, level: 'error' }, this._loggingBunyan.stream('error')],
			});
		}
		LoggingSingleton._errorInstance.info(message);
	}

	public static logWarning(message: string): void {
		if (!LoggingSingleton._warningInstance) {
			LoggingSingleton._warningInstance = bunyan.createLogger({
				name: LoggingSingleton._loggerName,
				streams: [{ stream: process.stdout, level: 'warn' }, this._loggingBunyan.stream('warn')],
			});
		}
		LoggingSingleton._warningInstance.info(message);
	}
}
