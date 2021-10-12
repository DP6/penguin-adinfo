import { RoutesPermission } from './RoutesPermission';

export class Campaign {
	private _name: string;
	private _company: string;
	private _agency: string;
	private _campaignId: string;
	private _activate: boolean;
	private _created: string;

	constructor(name: string, company: string, agency: string, campaignId: string, activate = true, created: string) {
		this._name = name;
		this._company = company;
		this._agency = agency;
		this._campaignId = campaignId;
		this._activate = activate;
		this._created = created;
	}

	/**
	 * Gera um JSON correspondente ao objeto Campaign
	 * @returns JSON correspondente ao objeto Campaign
	 */
	public toJson(): { [key: string]: string | boolean } {
		return {
			name: this._name,
			company: this._company,
			agency: this._agency,
			campaignId: this._campaignId,
			created: this._created,
			activate: this._activate,
		};
	}

	get name(): string {
		return this._name;
	}

	get agency(): string {
		return this._agency;
	}

	get company(): string {
		return this._company;
	}

	get created(): string {
		return this._created;
	}

	get activate(): boolean {
		return this._activate;
	}

	get campaignId(): string {
		return this._campaignId;
	}
}
