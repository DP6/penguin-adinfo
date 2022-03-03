import { RoutesPermission } from './RoutesPermission';
import { User } from './User'

export class ProgrammaticUser extends User {

	constructor(
		id: string,
		permission: string,
		company: string,
        email: string,
		activate = true,
		agency = '',
	) {
        super(id, permission, company, email, activate, agency, null);
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
		// IMPLEMENTAR
	}

	/**
	 * Gera um JSON com todos os atributos do objeto
	 * @returns JSON correspondente ao objeto User com todos os atributos
	 */
	public toJsonSave(): { [key: string]: string | boolean } {
		//IMPLEMENTAR
	}

	get permission(): string {
		return super.permission;
	}

	get agency(): string {
		return super.agency;
	}

	get company(): string {
		return super.company;
	}

	get activate(): boolean {
		return super.activate;
	}

	get id(): string {
		return super.id;
	}

    get email(): string {
        return super.email;
    }
}
