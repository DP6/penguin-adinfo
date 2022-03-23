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
const ApiResponse_1 = require('./models/ApiResponse');
const LoggingSingleton_1 = require('./models/cloud/LoggingSingleton');
const JWT_1 = require('./models/JWT');
const User_1 = require('./models/User');
const ProgrammaticUser_1 = require('./models/ProgrammaticUser');
const ProgrammaticUserDAO_1 = require('./models/DAO/ProgrammaticUserDAO');
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
			'password',
		],
		exposedHeaders: ['Authorization'],
		origin: '*',
		methods: 'GET, POST',
		preflightContinue: false,
	})
);
app.all('*', (req, res, next) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const apiResponse = new ApiResponse_1.ApiResponse();
		const url = req.originalUrl;
		if (url === '/login') {
			const log = {
				route: url,
				email: req.body.email || 'E-mail não informado!',
				headers: req.headers,
				body: req.body,
			};
			LoggingSingleton_1.LoggingSingleton.getInstance().logInfo(JSON.stringify(log));
			next();
		} else {
			const token = req.headers.token;
			const programmaticToken = req.headers.programmatictoken;
			let log = {};
			let permissionForRoute = false;
			try {
				if (token) {
					const payload = yield new JWT_1.JWT().validateToken(token);
					const user = new User_1.User(
						payload.id,
						payload.permission,
						payload.company,
						payload.email,
						payload.activate,
						payload.agency
					);
					log = {
						user: user.id,
						route: req.originalUrl,
						email: user.email,
						activate: user.activate,
						headers: req.headers,
						body: req.body,
					};
					permissionForRoute = user.hasPermissionFor(url, req.method);
					req.company = user.company;
					req.agency = user.agency;
					req.email = user.email;
					req.permission = user.permission;
					req.token = req.headers.token;
				} else if (programmaticToken) {
					const payloadProgrammaticAccess = yield new ProgrammaticUserDAO_1.ProgrammaticUserDAO().getProgrammaticUser(
						programmaticToken
					);
					log = {
						user: payloadProgrammaticAccess.id,
						route: req.originalUrl,
						email: '',
						activate: payloadProgrammaticAccess.activate,
						headers: req.headers,
						body: req.body,
					};
					const programmaticUser = new ProgrammaticUser_1.ProgrammaticUser(
						payloadProgrammaticAccess.id,
						payloadProgrammaticAccess.permission,
						payloadProgrammaticAccess.company,
						payloadProgrammaticAccess.email,
						payloadProgrammaticAccess.activate,
						payloadProgrammaticAccess.agency
					);
					permissionForRoute = programmaticUser.hasPermissionFor(url, req.method);
					req.company = programmaticUser.company;
					req.agency = programmaticUser.agency;
					req.email = programmaticUser.email;
					req.permission = programmaticUser.permission;
					req.token = req.headers.token;
				} else {
					apiResponse.responseText = 'Usuário sem permissão para realizar essa ação!';
					apiResponse.statusCode = 403;
					res.statusCode(apiResponse.statusCode).send(apiResponse.jsonResponse);
				}
				LoggingSingleton_1.LoggingSingleton.getInstance().logInfo(JSON.stringify(log));
				if (!permissionForRoute) {
					apiResponse.responseText = 'Usuário sem permissão para realizar essa ação!';
					apiResponse.statusCode = 403;
					res.statusCode(apiResponse.statusCode).send(apiResponse.jsonResponse);
				}
				next();
			} catch (e) {
				apiResponse.statusCode = 401;
				apiResponse.errorMessage = e.message;
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			}
		}
	})
);
routes_1.default(app);
app.get('/', (req, res) => res.status(200).send('OK'));
module.exports = app;
