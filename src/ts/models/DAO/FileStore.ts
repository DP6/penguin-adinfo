import { FileDAO } from '../DAO/FileDAO';

export abstract class FileStore {
	abstract saveFile(file: FileDAO, path: string): Promise<void>;
	abstract getFile(filePath: string): Promise<any>;
	abstract getAllFiles(folder: string): Promise<any>;
}
