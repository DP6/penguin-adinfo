'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Campaign = void 0;
class Campaign {
	constructor(name, company, agency, campaignId, activate = true, created) {
		this._name = name;
		this._company = company;
		this._agency = agency;
		this._campaignId = campaignId;
		this._activate = activate;
		this._created = created;
	}
	toJson() {
		return {
			company: this._company,
			agency: this._agency,
			campaignId: this._campaignId,
			created: this._created,
			activate: this._activate,
		};
	}
	get name() {
		return this._name;
	}
	get agency() {
		return this._agency;
	}
	get company() {
		return this._company;
	}
	get created() {
		return this._created;
	}
	get activate() {
		return this._activate;
	}
	get campaignId() {
		return this._campaignId;
	}
}
exports.Campaign = Campaign;
