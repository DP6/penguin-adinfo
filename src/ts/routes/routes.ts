import config from './config';
import csv from './csv';
import template from './template';
import build from './build';
import register from './register';
import user from './user';
import login from './login';
import campaign from './campaign';
import agency from './agency';

const routes = (app: { [key: string]: any }): void => {
	config(app);
	csv(app);
	template(app);
	build(app);
	register(app);
	user(app);
	login(app);
	campaign(app);
	agency(app);
};

export default routes;
