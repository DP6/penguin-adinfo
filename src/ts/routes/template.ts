import { ConfigDAO } from '../models/DAO/ConfigDAO';

const template = (app: { [key: string]: any }): void => {
	app.get(
		'/template',
		(req: { [key: string]: any }, res: { [key: string]: any }) => {
			const company = req.company;
			const configDAO = new ConfigDAO(company);
			configDAO
				.getLastConfig()
				.then((config) => {
					res.setHeader(
						'Content-disposition',
						'attachment; filename=template.csv'
					);
					res.set('Content-Type', 'text/csv; charset=utf-8');
					if (config) {
						res.status(200).send(config.toCsvTemplate());
					} else {
						res.status(200).send('{}');
					}
				})
				.catch((err) => {
					res.status(500).send('Erro ao recuperar configuração!');
				});
		}
	);
};

export default template;
