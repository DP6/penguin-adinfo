import config from './config';

module.exports = (app: { [key: string]: any }) => {
	config(app);
};
