import config from './config';
import csv from './csv';
import template from './template';
import build from './build';
import register from './register';

const routes = (app: { [key: string]: any }) => {
	config(app);
	csv(app);
	template(app);
	build(app);
	register(app);
};

export default routes;
