import { FileStore } from '../DAO/FileStore';
import { StorageConnectionSingleton } from '../cloud/StorageConnectionSingleton';

export class FileDAO {
	private _file: Buffer;
	private _fileStore: FileStore;

	constructor() {
		this._fileStore = StorageConnectionSingleton.getInstance();
	}

	get file(): Buffer {
		return this._file;
	}

	set file(file: Buffer) {
		this._file = file;
	}

	/**
	 * Salva um arquivo no banco de arquivos
	 * @param path Caminho para salvar o arquivo
	 */
	public save(path: string): Promise<void> {
		return this._fileStore.saveFile(this, path);
	}

	/**
	 * Pega um arquivo do banco de arquivos
	 * @param filePath Caminho do arquivo no banco
	 */
	public getFromStore(filePath: string): Promise<Buffer> {
		return this._fileStore.getFile(filePath);
	}

	public async getContentFrom(filePath: string, contentDefault = ''): Promise<Buffer> {
		let fileBuffer: Buffer;
		try {
			fileBuffer = await this._fileStore.getFile(filePath);
		} catch (e) {
			fileBuffer = Buffer.from(contentDefault);
		}
		return fileBuffer;
	}

	/**
	 * Pegar todos os arquivos de uma agencia
	 * @param agency nome da agencia
	 */
	public getAllFilesFromStore(path: string): Promise<File[][]> {
		return this._fileStore.getAllFiles(path);
	}
}
