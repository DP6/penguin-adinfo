'use strict';
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step(
				(generator = generator.apply(thisArg, _arguments || [])).next()
			);
		});
	};
Object.defineProperty(exports, '__esModule', { value: true });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const routes_1 = require('./routes/routes');
const dotenv_1 = require('dotenv');
const AuthDAO_1 = require('./models/DAO/AuthDAO');
dotenv_1.config({ path: __dirname + '/../../.env' });
const app = express();
app.use(
	fileUpload({
		createParentPath: true,
	})
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
	cors({
		allowedHeaders: [
			'token',
			'agency',
			'Content-Type',
			'company',
			'file',
			'data',
			'config',
			'permission',
		],
		exposedHeaders: [
			'token',
			'agency',
			'company',
			'file',
			'data',
			'config',
			'permission',
		],
		origin: '*',
		methods: 'GET,POST',
		preflightContinue: false,
	})
);
app.all('*', (req, res, next) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const token = req.headers.token;
		if (token) {
			const authDAO = new AuthDAO_1.AuthDAO(token);
			authDAO
				.getAuth()
				.then((auth) => {
					req.company = auth.company;
					req.agency = auth.agency;
					if (auth.hasPermissionFor(req.url, req.method)) {
						next();
					} else {
						res.status(403).send(
							'Usuário sem permissão para realizar a ação!'
						);
					}
				})
				.catch((err) => {
					res.status(403).send('Usuário Inválido');
				});
		} else {
			res.status(403).send('Token não informado!');
		}
	})
);
routes_1.default(app);
app.get('/', (req, res) => res.status(200).send('OK'));
module.exports = app;
