'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const config_1 = require('./config');
const csv_1 = require('./csv');
module.exports = (app) => {
	config_1.default(app);
	csv_1.default(app);
};
