"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingSingleton = void 0;
const Log_1 = require("../Log");
const bunyan = require("bunyan");
const logging_bunyan_1 = require("@google-cloud/logging-bunyan");
class LoggingSingleton extends Log_1.Log {
    constructor() {
        super();
        this._loggingBunyan = new logging_bunyan_1.LoggingBunyan();
        this._loggerName = 'adinfo';
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
    static getInstance() {
        if (!LoggingSingleton._instance) {
            LoggingSingleton._instance = new LoggingSingleton();
        }
        return LoggingSingleton._instance;
    }
    logInfo(message) {
        if (process.env.ENV === 'development') {
            console.info(message);
        }
        else {
            this._infoInstance.info(message);
        }
    }
    logError(message) {
        if (process.env.ENV === 'development') {
            console.error(message);
        }
        else {
            this._errorInstance.error(message);
        }
    }
    logWarning(message) {
        if (process.env.ENV === 'development') {
            console.warn(message);
        }
        else {
            this._warningInstance.warn(message);
        }
    }
}
exports.LoggingSingleton = LoggingSingleton;
