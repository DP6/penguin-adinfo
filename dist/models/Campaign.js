'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Campaign = void 0;
class Campaign {
	constructor(name, company, agency, campaignId, activate, created) {
		this._name = name;
		this._company = company;
		this._agency = agency;
		this._campaignId = campaignId;
		this._activate = activate;
		this._created = created;
	}
	toJson() {
		return {
			name: this._name,
			company: this._company,
			agency: this._agency,
			campaignId: this._campaignId,
			created: this._created,
			activate: this._activate,
		};
	}
	validateCampaignInfos() {
		return !(!this._name || !this._company || !this._agency || !this._campaignId || !this._activate || !this._created);
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
