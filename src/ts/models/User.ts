import { RoutesPermission } from './RoutesPermission';
import * as bcrypt from 'bcrypt';

export class User {
	private _permission: string;
	private _agency: string;
	private _company: string;
	private _email: string;
	private _id: string;
	private _password: string;
	private _salt = parseInt(process.env.SALT);

	constructor(id: string, permission: string, company: string, email: string, agency = '', password?: string) {
		this._permission = permission;
		this._agency = agency;
		this._company = company;
		this._email = email;
		this._id = id;
		this._password = password;
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
	public toJson(): { [key: string]: string } {
		return {
			agency: this._agency,
			company: this._company,
			permission: this._permission,
			email: this._email,
			id: this._id,
		};
	}

	/**
	 * Gera um JSON com todos os atributos do objeto
	 * @returns JSON correspondente ao objeto User com todos os atributos
	 */
	public toJsonSave(): { [key: string]: string } {
		return {
			agency: this._agency,
			company: this._company,
			permission: this._permission,
			email: this._email,
			password: bcrypt.hashSync(this._password, this._salt),
		};
	}

	set password(newPassword: string) {
		this._password = newPassword;
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

	get id(): string {
		return this._id;
	}
}
