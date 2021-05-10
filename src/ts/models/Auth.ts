import { RoutesPermission } from './RoutesPermission';

export class Auth {
	private _permission: string;
	private _agency: string;
	private _company: string;
	private _email: string;

	constructor(permission: string, company: string, agency = '', email: string) {
		this._permission = permission;
		this._agency = agency;
		this._company = company;
		this._email = email;
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
			email: this._email,
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

	get email(): string {
		return this._email;
	}
}
