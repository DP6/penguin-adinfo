import { ConfigDAO } from '../models/DAO/ConfigDAO';
import { Config } from '../models/Config';

const config = (app: { [key: string]: any }) => {
	app.post(
		'/config',
		(req: { [key: string]: any }, res: { [key: string]: any }) => {
			const company = req.body.company;
			const configString = req.body.config;
			if (!company) {
				res.status(500).send('Nome da empresa não foi informado!');
				return;
			} else if (!configString) {
				res.status(500).send('Configuração não foi informada!');
				return;
			}
			const config = new Config(JSON.parse(configString));
			const configDAO = new ConfigDAO(company);
			configDAO
				.addConfig(config)
				.then(() => {
					res.status(200).send('Configuração criada com sucesso!');
				})
				.catch((err) => {
					res.status(500).send('Erro ao criar a configuração!');
				});
		}
	);

	app.get(
		'/config',
		(req: { [key: string]: any }, res: { [key: string]: any }) => {
			const company = req.headers.company;
			if (!company) {
				res.status(500).send('Nome da empresa não foi informado!');
				return;
			}
			const configDAO = new ConfigDAO(company);
			configDAO
				.getLastConfig()
				.then((config) => {
					if (config) {
						res.status(200).send(config.toString());
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

export default config;
