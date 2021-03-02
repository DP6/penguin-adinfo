import { DownloadResponse, Storage } from '@google-cloud/storage';
import * as credentials from '../../config/gcp_key.json';
import { FileStore } from '../DAO/FileStore';
import { FileDAO } from '../DAO/FileDAO';

export class StorageConnectionSingleton extends FileStore {
	private _db: Storage;
	private _bucket = `adinfo-dp6-files`;
	private static _instance: StorageConnectionSingleton;

	private constructor() {
		super();
		if (process.env.DEVELOPMENT) {
			this._db = new Storage({ credentials });
		} else {
			this._db = new Storage();
		}
	}

	/**
	 * Retorna a instancia atual da classe
	 */
	public static getInstance(): StorageConnectionSingleton {
		if (!StorageConnectionSingleton._instance) {
			StorageConnectionSingleton._instance = new StorageConnectionSingleton();
		}
		return StorageConnectionSingleton._instance;
	}

	/**
	 * Salva um arquivo no Storage
	 * @param file arquivo a ser salvo
	 * @param path caminho para salvar o arquivo
	 */
	public saveFile(file: FileDAO, path: string): Promise<void> {
		const destinationBucket = this._db.bucket(this._bucket);
		const destinationPath = destinationBucket.file(path);
		return destinationPath.save(file.file);
	}

	/**
	 * Recupera um arquivo do storage
	 * @param filePath caminho do arquivo
	 */
	public getFile(filePath: string): Promise<DownloadResponse> {
		const destinationPath = this._db.bucket(this._bucket).file(filePath);
		return destinationPath.download();
	}

	/**
	 * Recupera todos os arquivos de uma pasta
	 * @param folder pasta dos arquivos
	 */
	public getAllFiles(folder: string): Promise<File[][]> {
		return this._db.bucket(this._bucket).getFiles({ prefix: `${folder}/` });
	}
}
