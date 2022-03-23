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

app.all('*', async (req: { [key: string]: any }, res: { [key: string]: any }, next: any) => {
	const apiResponse = new ApiResponse();
	const url = req.originalUrl;
	if (url === '/login') {
		const log = {
			route: url,
			email: req.body.email || 'E-mail não informado!',
			headers: req.headers,
			body: req.body,
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
					payload.company,
					payload.email,
					payload.activate,
					payload.agency
				);

				// await FirestoreConnectionSingleton.getInstance()
				// 	.getCollection(['tokens'])
				// 	.where('__name__', '==', user.id)
				// 	.get()
				// 	.then((querySnapshot: QuerySnapshot) => {
				// 		if (querySnapshot.size > 0) {
				// 			querySnapshot.forEach((documentSnapshot) => {
				// 				if (!documentSnapshot.get('activate')) {
				// 					throw new Error('Usuário sem permissão para realizar esta ação!');
				// 				}
				// 			});
				// 		} else {
				// 			throw new Error('Usuário inválido!');
				// 		}
				// 	})
				// 	.catch((err) => {
				// 		throw err;
				// 	});

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
				const payloadProgrammaticAccess = await new ProgrammaticUserDAO().getProgrammaticUser(programmaticToken);
				log = {
					user: payloadProgrammaticAccess.id,
					route: req.originalUrl,
					email: '',
					activate: payloadProgrammaticAccess.activate,
					headers: req.headers,
					body: req.body,
				};

				const programmaticUser = new ProgrammaticUser(
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
