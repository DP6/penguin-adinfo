import { RoutesPermission } from './RoutesPermission';

export class Auth {
	private _permission: string;
	private _agency: string;

	constructor(permission: string, agency = '') {
		this._permission = permission;
		this._agency = agency;
	}

	/**
	 * Verifica se o usuário tem permissão para acessar determinada rota
	 * @param route Rota que se deseja acessar
	 * @param method Método de acesso à rota
	 */
	public hasPermissionFor(route: string, method: string): boolean {
		return new RoutesPermission(route, method).validatePermission(this);
	}

	get permission(): string {
		return this._permission;
	}
}
