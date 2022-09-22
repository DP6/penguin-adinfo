import * as jwt from 'jsonwebtoken';
import { JwtPayload, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { BlockList } from './BlockList';
import { User } from './User';

export class JWT {
	private _pass: string = process.env.JWT_KEY;
	private _user: User;
	private _expiresToken: string = process.env.EXPIRES_TOKEN;

	constructor(user?: User) {
		this._user = user || undefined;
	}

	/**
	 * Criação de um token para o usuario especificado
	 * @returns string correspondendo ao token criado
	 */
	public createToken(): string {
		const payload = this._user.toJson();
		const token = jwt.sign(payload, this._pass, { expiresIn: this._expiresToken });
		return token;
	}

	/**
	 * Valida se o token é válido sem olhar a blocklist
	 * @param token token a ser verificado
	 * @returns boolean informando se o token é válido
	 */
	public verifyWithoutBlocklist(token: string): boolean {
		try {
			jwt.verify(token, this._pass);
			return true;
		} catch (err) {
			return false;
		}
	}

	/**
	 * Valida se o token informado é valido
	 * @param token token informado pelo usuario
	 * @returns payload do usuário
	 */
	public async validateToken(token: string): Promise<JwtPayload> {
		const userInBlocklist = await new BlockList().findToken(token);
		if (userInBlocklist) {
			throw new Error('Token inválido!');
		}
		try {
			const payload = jwt.verify(token, this._pass);
			if (typeof payload === 'object') {
				return payload;
			}
		} catch (er) {
			if (er instanceof TokenExpiredError) {
				throw new Error('Token expirado! Faça o login novamente.');
			} else if (er instanceof JsonWebTokenError) {
				throw new Error('Token inválido!');
			}
			throw new Error(er);
		}
	}
}
