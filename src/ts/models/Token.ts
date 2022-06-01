import { RoutesPermission } from './RoutesPermission';
import { User } from './User';

export class Token extends User {
	constructor(id: string, permission: string, advertiser: string, email: string, active = true, adOpsTeam = '') {
		super(id, permission, advertiser, email, active, adOpsTeam, null);
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
	 * Gera um JSON correspondente ao objeto User sem o atributo password
	 * @returns JSON correspondente ao objeto User
	 */
	public toJson(): { [key: string]: string | boolean } {
		return {
			adOpsTeam: this.adOpsTeam,
			advertiser: this.advertiser,
			permission: this.permission,
			email: this.email,
			id: this.id,
			active: this.active,
		};
	}

	/**
	 * Gera um JSON com todos os atributos do objeto
	 * @returns JSON correspondente ao objeto User com todos os atributos
	 */
	public toJsonSave(): { [key: string]: string | boolean } {
		return {
			adOpsTeam: this.adOpsTeam,
			advertiser: this.advertiser,
			permission: this.permission,
			email: this.email,
			active: this.active,
		};
	}

	get permission(): string {
		return super.permission;
	}

	get adOpsTeam(): string {
		return super.adOpsTeam;
	}

	get advertiser(): string {
		return super.advertiser;
	}

	get active(): boolean {
		return super.active;
	}

	get id(): string {
		return super.id;
	}

	get email(): string {
		return super.email;
	}
}
