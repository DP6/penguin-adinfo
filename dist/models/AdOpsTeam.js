"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdOpsTeam = void 0;
class AdOpsTeam {
    constructor(name, active, advertiserId) {
        this._name = name;
        this._active = active;
        this._advertiserId = advertiserId;
    }
    toJson() {
        return {
            name: this._name,
            active: this._active,
            advertiserId: this._advertiserId,
        };
    }
    validateAdOpsTeamInfos() {
        return !(!this._name || !this._active || !this._advertiserId);
    }
    get name() {
        return this._name;
    }
    get active() {
        return this._active;
    }
    get advertiserId() {
        return this._advertiserId;
    }
}
exports.AdOpsTeam = AdOpsTeam;
