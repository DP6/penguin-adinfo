'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.LoggingSingleton = void 0;
const Log_1 = require('../Log');
const credentials = require('../../../../config/gcp_key.json');
const bunyan = require('bunyan');
const logging_bunyan_1 = require('@google-cloud/logging-bunyan');
class LoggingSingleton extends Log_1.Log {
	constructor() {
		super();
	}
	static logInfo(message) {
		if (!LoggingSingleton._infoInstance) {
			LoggingSingleton._infoInstance = bunyan.createLogger({
				name: LoggingSingleton._loggerName,
				streams: [
					{ stream: process.stdout, level: 'info' },
					this._loggingBunyan.stream('info'),
				],
			});
		}
		LoggingSingleton._infoInstance.info(message);
	}
	static logError(message) {
		if (!LoggingSingleton._errorInstance) {
			LoggingSingleton._errorInstance = bunyan.createLogger({
				name: LoggingSingleton._loggerName,
				streams: [
					{ stream: process.stdout, level: 'error' },
					this._loggingBunyan.stream('error'),
				],
			});
		}
		LoggingSingleton._errorInstance.info(message);
	}
	static logWarning(message) {
		if (!LoggingSingleton._warningInstance) {
			LoggingSingleton._warningInstance = bunyan.createLogger({
				name: LoggingSingleton._loggerName,
				streams: [
					{ stream: process.stdout, level: 'warn' },
					this._loggingBunyan.stream('warn'),
				],
			});
		}
		LoggingSingleton._warningInstance.info(message);
	}
}
exports.LoggingSingleton = LoggingSingleton;
LoggingSingleton._loggingBunyan = new logging_bunyan_1.LoggingBunyan({
	credentials,
});
LoggingSingleton._loggerName = 'adinfo';
