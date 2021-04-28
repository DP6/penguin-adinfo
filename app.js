require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { AuthDAO } = require('./src/js/src/ts/models/DAO/AuthDAO.js');

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
		allowedHeaders: ['token', 'agency', 'Content-Type', 'company', 'file', 'data', 'config'],
		exposedHeaders: ['token', 'agency', 'company', 'file', 'data', 'config'],
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		preflightContinue: false,
	})
);

const routes = require('./src/js/src/ts/routes/routes');

app.all('*', async (req, res, next) => {
	let authDAO;
	if (req.headers.company && req.headers.token) {
		authDAO = new AuthDAO(req.headers.company, req.headers.token);
	} else {
		authDAO = new AuthDAO(req.body.company, req.body.token);
	}
	authDAO
		.getAuth()
		.then((auth) => {
			if (auth.hasPermissionFor(req.url, req.method)) {
				next();
			} else {
				res.status(403).send('Usuário sem permissão para realizar a ação!');
			}
		})
		.catch((err) => {
			res.status(403).send('Usuário Inválido');
		});
});

routes.default(app);

app.get('/', (req, res) => res.status(200).send('OK'));

module.exports = app;
