"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsTool = void 0;
const Parametrizer_1 = require("./Parametrizer");
class AnalyticsTool extends Parametrizer_1.Parametrizer {
    get url() {
        return this._url;
    }
    set url(url) {
        this._url = url;
    }
}
exports.AnalyticsTool = AnalyticsTool;
