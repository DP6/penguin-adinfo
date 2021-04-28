'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const AuthDAO_1 = require('../models/DAO/AuthDAO');
const user = (app) => {
	app.get('/user', (req, res) => {
		new AuthDAO_1.AuthDAO(req.headers.token)
			.getAuth()
			.then((data) => {
				if (data) {
					res.status(200).send(JSON.stringify(data.toJson()));
				} else {
					res.status(200).send(JSON.stringify('{}'));
				}
			})
			.catch((err) => {
				res.status(500).send('Falha ao recuperar o usuário!');
			});
	});
};
exports.default = user;
