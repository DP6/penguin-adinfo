'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.JsonUtils = void 0;
const StringUtils_1 = require('./StringUtils');
class JsonUtils {
	static _keyValueIsAnObject(keyValue) {
		return typeof keyValue === 'object';
	}
	/**
	 * Normaliza as chaves de um JSON
	 * @param json
	 * @returns Objeto JSON com as chaves normalizadas
	 *
	 * Retira os caracteres maiúsculos e especiais das chaves de um objeto JSON
	 */
	static normalizeKeys(json) {
		const jsonNormalized = {};
		Object.keys(json).map((key) => {
			jsonNormalized[StringUtils_1.StringUtils.normalize(key)] =
				json[key];
			if (
				this._keyValueIsAnObject(
					jsonNormalized[StringUtils_1.StringUtils.normalize(key)]
				)
			) {
				jsonNormalized[
					StringUtils_1.StringUtils.normalize(key)
				] = this.normalizeKeys(
					jsonNormalized[StringUtils_1.StringUtils.normalize(key)]
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
	static addParametersAt(json, ...objectsToMerge) {
		const jsonToAdd = json;
		objectsToMerge.forEach((objectToMerge) => {
			Object.keys(objectToMerge).map((parameter) => {
				jsonToAdd[parameter] = objectToMerge[parameter];
			});
		});
		return jsonToAdd;
	}
}
exports.JsonUtils = JsonUtils;
