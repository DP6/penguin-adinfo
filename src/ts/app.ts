import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as fileUpload from 'express-fileupload';
import routes from './routes/routes';
import { config } from 'dotenv';
import { Auth } from './models/Auth';
import { AuthDAO } from './models/DAO/AuthDAO';
import { ApiResponse } from './models/ApiResponse';
import { LoggingSingleton } from './models/cloud/LoggingSingleton';

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
		],
		exposedHeaders: ['token', 'agency', 'company', 'campaign', 'file', 'data', 'config', 'permission', 'email'],
		origin: '*',
		methods: 'GET, POST',
		preflightContinue: false,
	})
);

app.all('*', async (req: { [key: string]: any }, res: { [key: string]: any }, next: any) => {
	const token = req.headers.token;

	const log = {
		route: req.originalUrl,
		token,
		heades: req.headers,
		body: req.body,
	};

	LoggingSingleton.getInstance().logInfo(JSON.stringify(log));

	const apiResponse = new ApiResponse();

	if (token) {
		const authDAO = new AuthDAO(token);
		authDAO
			.getAuth()
			.then((auth: Auth) => {
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
});

routes(app);

app.get('/', (req: { [key: string]: any }, res: { [key: string]: any }) => res.status(200).send('OK'));

module.exports = app;
