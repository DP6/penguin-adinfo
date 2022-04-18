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
import { ProgrammaticUser } from './models/ProgrammaticUser';
import { ProgrammaticUserDAO } from './models/DAO/ProgrammaticUserDAO';

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
				const payloadProgrammaticAccess = await new ProgrammaticUserDAO().getProgrammaticUser(programmaticToken);

				const headers = { ...req.headers };
				delete headers['token'];

				log = {
					user: payloadProgrammaticAccess.id,
					route: req.originalUrl,
					email: '',
					active: payloadProgrammaticAccess.active,
					headers: headers,
					body: req.body,
				};

				const programmaticUser = new ProgrammaticUser(
					payloadProgrammaticAccess.id,
					payloadProgrammaticAccess.permission,
					payloadProgrammaticAccess.advertiser,
					payloadProgrammaticAccess.email,
					payloadProgrammaticAccess.active,
					payloadProgrammaticAccess.adOpsTeam
				);

				permissionForRoute = programmaticUser.hasPermissionFor(url, req.method);

				req.advertiser = programmaticUser.advertiser;
				req.adOpsTeam = programmaticUser.adOpsTeam;
				req.email = programmaticUser.email;
				req.permission = programmaticUser.permission;
				req.token = req.headers.token;
			} else {
				apiResponse.responseText = 'Usuário sem permissão para realizar essa ação!';
				apiResponse.statusCode = 403;
				res.statusCode(apiResponse.statusCode).send(apiResponse.jsonResponse);
			}

			LoggingSingleton.getInstance().logInfo(JSON.stringify(log));

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
});

routes(app);

app.get('/', (req: { [key: string]: any }, res: { [key: string]: any }) => res.status(200).send('OK'));

module.exports = app;
