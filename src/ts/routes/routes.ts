import config from './config';
import csv from './csv';

module.exports = (app: { [key: string]: any }) => {
	config(app);
	csv(app);
};
