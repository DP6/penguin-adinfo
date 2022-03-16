import { RoutesPermission } from './RoutesPermission';
import * as bcrypt from 'bcrypt';

export class User {
	private _permission: string;
	private _adOpsTeam: string;
	private _advertiser: string;
	private _email: string;
	private _id: string;
	private _password: string;
	private _active: boolean;
	private _salt = parseInt(process.env.SALT);

	constructor(
		id: string,
		permission: string,
		advertiser: string,
		email: string,
		active = true,
		adOpsTeam = '',
		password?: string
	) {
		this._permission = permission;
		this._adOpsTeam = adOpsTeam;
		this._advertiser = advertiser;
		this._email = email;
		this._id = id;
		this._password = password;
		this._active = active;
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
			adOpsTeam: this._adOpsTeam,
			advertiser: this._advertiser,
			permission: this._permission,
			email: this._email,
			id: this._id,
			active: this._active,
		};
	}

	/**
	 * Gera um JSON com todos os atributos do objeto
	 * @returns JSON correspondente ao objeto User com todos os atributos
	 */
	public toJsonSave(): { [key: string]: string | boolean } {
		return {
			adOpsTeam: this._adOpsTeam,
			advertiser: this._advertiser,
			permission: this._permission,
			email: this._email,
			active: this._active,
			password: bcrypt.hashSync(this._password, this._salt),
		};
	}

	set password(newPassword: string) {
		this._password = newPassword;
	}

	get permission(): string {
		return this._permission;
	}

	get adOpsTeam(): string {
		return this._adOpsTeam;
	}

	get advertiser(): string {
		return this._advertiser;
	}

	get email(): string {
		return this._email;
	}

	get active(): boolean {
		return this._active;
	}

	get id(): string {
		return this._id;
	}
}
