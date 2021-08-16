import * as jwt from 'jsonwebtoken';
import { User } from './User';

export class JWT {
	private _pass: string = process.env.JWT_KEY;
	private _user: User;

	constructor(user?: User) {
		this._user = user || undefined;
	}

	/**
	 * Criação de um token para o usuario especificado
	 * @returns string correspondendo ao token criado
	 */
	public createToken(): string {
		const payload = this._user.toJson();

		const token = jwt.sign(payload, this._pass);

		return token;
	}

	/**
	 * Valida se o token informado é valido
	 * @param token token informado pelo usuario
	 * @returns User do usuário
	 */
	public validateToken(token: string): User {
		const payload = jwt.verify(token, this._pass);
		if (typeof payload === 'object') {
			return new User(payload.id, payload.permission, payload.company, payload.email, payload.agency);
		}
	}
}
