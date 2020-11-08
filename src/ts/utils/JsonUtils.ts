import { StringUtils } from './StringUtils';

export class JsonUtils {
	private static _keyValueIsAnObject(keyValue: any): boolean {
		return typeof keyValue === 'object' && !Array.isArray(keyValue);
	}

	/**
	 * Normaliza as chaves de um JSON
	 * @param json
	 * @returns Objeto JSON com as chaves normalizadas
	 *
	 * Retira os caracteres maiúsculos e especiais das chaves de um objeto JSON
	 */
	static normalizeKeys(json: { [key: string]: any }): { [key: string]: any } {
		const jsonNormalized: { [key: string]: any } = {};
		Object.keys(json).map((key) => {
			jsonNormalized[StringUtils.normalize(key)] = json[key];
			if (
				this._keyValueIsAnObject(
					jsonNormalized[StringUtils.normalize(key)]
				)
			) {
				jsonNormalized[StringUtils.normalize(key)] = this.normalizeKeys(
					jsonNormalized[StringUtils.normalize(key)]
				);
			}
		});
		return jsonNormalized;
	}

	/**
	 * Adiciona novos parâmetros a um Json
	 * @param json Json a ser adicionado os novos parametros
	 * @param arrayOfObjectsToMerge Json com os novos parametros
	 * @returns Merge dos jsons recebidos
	 *
	 * Recebe um objeto JSON e vários objetos para fazer uma união de todos objetos json
	 */
	static addParametersAt(
		json: { [key: string]: any },
		...objectsToMerge: { [key: string]: any }[]
	): { [key: string]: any } {
		const jsonToAdd: { [key: string]: any } = json;
		objectsToMerge.forEach((objectToMerge) => {
			Object.keys(objectToMerge).map((parameter) => {
				jsonToAdd[parameter] = objectToMerge[parameter];
			});
		});
		return jsonToAdd;
	}
}
