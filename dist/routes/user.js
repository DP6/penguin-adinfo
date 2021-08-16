'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const ApiResponse_1 = require('../models/ApiResponse');
const user = (app) => {
	app.get('/user', (req, res) => {
		const apiResponse = new ApiResponse_1.ApiResponse();
		const user = {
			permission: req.permission,
			agency: req.agency,
			company: req.company,
			email: req.email,
		};
		apiResponse.statusCode = 200;
		apiResponse.responseText = JSON.stringify(user);
		res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
	});
};
exports.default = user;
