export class AdOpsTeam {
	private _name: string;
	private _active: boolean;
	private _advertiserId: string;

	constructor(name: string, active: boolean, advertiserId: string) {
		this._name = name;
		this._active = active;
		this._advertiserId = advertiserId;
	}

	/**
	 * Gera um JSON correspondente ao objeto AdOpsTeam
	 * @returns JSON correspondente ao objeto AdOpsTeam
	 */
	public toJson(): { [key: string]: string | boolean } {
		return {
			name: this._name,
			active: this._active,
			advertiserId: this._advertiserId,
		};
	}

	/**
	 * Checa se há todas as informações de campanha vindas do Firestore
	 */
	public validateAdOpsTeamInfos(): boolean {
		return !(!this._name || !this._active || !this._advertiserId);
	}

	get name(): string {
		return this._name;
	}

	get active(): boolean {
		return this._active;
	}

	get advertiserId(): string {
		return this._advertiserId;
	}
}
