import config from './config';
import csv from './csv';
import template from './template';

module.exports = (app: { [key: string]: any }) => {
	config(app);
	csv(app);
	template(app);
};
