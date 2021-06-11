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
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
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
const ApiResponse_1 = require('./models/ApiResponse');
const LoggingSingleton_1 = require('./models/cloud/LoggingSingleton');
dotenv_1.config({ path: __dirname + '/../.env' });
const app = express();
LoggingSingleton_1.LoggingSingleton.getInstance().logInfo('Iniciando Adinfo!');
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
			'company',
			'campaign',
			'Content-Type',
			'file',
			'data',
			'config',
			'permission',
			'email',
		],
		exposedHeaders: ['token', 'agency', 'company', 'campaign', 'file', 'data', 'config', 'permission', 'email'],
		origin: '*',
		methods: 'GET, POST',
		preflightContinue: false,
	})
);
app.all('*', (req, res, next) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const token = req.headers.token;
		const log = {
			route: req.originalUrl,
			token,
			heades: req.headers,
			body: req.body,
		};
		LoggingSingleton_1.LoggingSingleton.getInstance().logInfo(JSON.stringify(log));
		const apiResponse = new ApiResponse_1.ApiResponse();
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
						apiResponse.responseText = 'Usuário sem permissão para realizar a ação!';
						apiResponse.statusCode = 403;
					}
				})
				.catch((err) => {
					apiResponse.responseText = 'Usuário Inválido!';
					apiResponse.statusCode = 401;
					apiResponse.errorMessage = err.message;
				})
				.finally(() => {
					if (apiResponse.statusCode !== 200) {
						res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
					}
				});
		} else {
			apiResponse.responseText = 'Token não informado!';
			apiResponse.statusCode = 401;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
		}
	})
);
routes_1.default(app);
app.get('/', (req, res) => res.status(200).send('OK'));
module.exports = app;
