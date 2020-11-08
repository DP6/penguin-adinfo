'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.JsonUtils = void 0;
const StringUtils_1 = require('./StringUtils');
class JsonUtils {
	static _keyValueIsAnObject(keyValue) {
		return typeof keyValue === 'object' && !Array.isArray(keyValue);
	}
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
