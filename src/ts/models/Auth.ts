import { RoutesPermission } from './RoutesPermission';

export class Auth {
	private _permission: string;
	private _agency: string;
	private _company: string;

	constructor(permission: string, company: string, agency = '') {
		this._permission = permission;
		this._agency = agency;
		this._company = company;
	}

	/**
	 * Verifica se o usuário tem permissão para acessar determinada rota
	 * @param route Rota que se deseja acessar
	 * @param method Método de acesso à rota
	 */
	public hasPermissionFor(route: string, method: string): boolean {
		return new RoutesPermission(route, method).validatePermission(this);
	}

	/**
	 * Retorna um JSON correspondente ao objeto Auth
	 */
	public toJson(): { [key: string]: string } {
		return {
			agency: this._agency,
			company: this._company,
			permission: this._permission,
		};
	}

	get permission(): string {
		return this._permission;
	}

	get agency(): string {
		return this._agency;
	}

	get company(): string {
		return this._company;
	}
}
