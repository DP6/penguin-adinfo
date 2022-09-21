import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as fileUpload from 'express-fileupload';
import routes from './routes/routes';
import { config } from 'dotenv';
import { ApiResponse } from './models/ApiResponse';
import { LoggingSingleton } from './models/cloud/LoggingSingleton';
import { JWT } from './models/JWT';
import { User } from './models/User';
import { Token } from './models/Token';
import { TokenDAO } from './models/DAO/TokenDAO';

config({ path: __dirname + '/../.env' });

const app = express();

LoggingSingleton.getInstance().logInfo('Iniciando Adinfo!');

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
			'adOpsTeam',
			'advertiser',
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

app.all('*', async (req: { [key: string]: any }, res: { [key: string]: any }, next: any) => {
	const apiResponse = new ApiResponse();
	const url = req.originalUrl;
	if (url === '/login') {
		const log = {
			route: url,
			email: req.body.email || 'E-mail não informado!',
			headers: req.headers,
		};
		LoggingSingleton.getInstance().logInfo(JSON.stringify(log));
		next();
	} else {
		const token = req.headers.token;
		const programmaticToken = req.headers.programmatictoken;

		let log = {};
		let permissionForRoute = false;

		try {
			if (token) {
				const payload = await new JWT().validateToken(token);

				const user = new User(
					payload.id,
					payload.permission,
					payload.advertiser,
					payload.email,
					payload.active,
					payload.adOpsTeam
				);

				const headers = { ...req.headers };
				delete headers['token'];

				log = {
					user: user.id,
					route: req.originalUrl,
					email: user.email,
					active: user.active,
					headers: headers,
					body: req.body,
				};

				permissionForRoute = user.hasPermissionFor(url, req.method);

				req.advertiser = user.advertiser;
				req.adOpsTeam = user.adOpsTeam;
				req.email = user.email;
				req.permission = user.permission;
				req.token = req.headers.token;
			} else if (programmaticToken) {
				const payloadTokenAccess = await new TokenDAO().getToken(programmaticToken);

				const headers = { ...req.headers };
				delete headers['token'];

				log = {
					user: payloadTokenAccess.id,
					route: req.originalUrl,
					email: '',
					active: payloadTokenAccess.active,
					headers: headers,
					body: req.body,
				};

				const token = new Token(
					payloadTokenAccess.id,
					payloadTokenAccess.permission,
					payloadTokenAccess.advertiser,
					payloadTokenAccess.email,
					payloadTokenAccess.active,
					payloadTokenAccess.adOpsTeam
				);

				permissionForRoute = token.hasPermissionFor(url, req.method);

				req.advertiser = token.advertiser;
				req.adOpsTeam = token.adOpsTeam;
				req.email = token.email;
				req.permission = token.permission;
				req.token = req.headers.token;
			} else {
				apiResponse.responseText = 'Usuário sem permissão para realizar essa ação!';
				apiResponse.statusCode = 403;
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			}

			LoggingSingleton.getInstance().logInfo(JSON.stringify(log));

			if (!permissionForRoute) {
				apiResponse.responseText = 'Usuário sem permissão para realizar essa ação!';
				apiResponse.statusCode = 403;
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			}

			next();
		} catch (e) {
			apiResponse.statusCode = 401;
			apiResponse.errorMessage = e.message;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
		}
	}
});

routes(app);

app.get('/', (req: { [key: string]: any }, res: { [key: string]: any }) => res.status(200).send('OK'));

module.exports = app;
