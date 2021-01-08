import config from './config';
import csv from './csv';
import template from './template';
import build from './build';
import register from './register';

module.exports = (app: { [key: string]: any }) => {
	config(app);
	csv(app);
	template(app);
	build(app);
	register(app);
};
