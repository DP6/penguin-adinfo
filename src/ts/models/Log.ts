export abstract class Log {
	abstract logInfo(message: string): void;
	abstract logError(message: string): void;
	abstract logWarning(message: string): void;
}
