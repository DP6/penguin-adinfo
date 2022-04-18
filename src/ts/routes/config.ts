import { ConfigDAO } from '../models/DAO/ConfigDAO';
import { Config } from '../models/Config';
import { ApiResponse } from '../models/ApiResponse';

const config = (app: { [key: string]: any }): void => {
	app.post('/config', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const advertiser = req.advertiser;
		const configString = req.body.config;

		const apiResponse = new ApiResponse();

		if (!configString) {
			apiResponse.responseText = 'Configuração não foi informada!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		}

		const config = new Config(JSON.parse(configString));
		const configDAO = new ConfigDAO(advertiser);

		configDAO
			.addConfig(config)
			.then(() => {
				apiResponse.responseText = 'Configuração criada com sucesso!';
				apiResponse.statusCode = 200;
			})
			.catch((err) => {
				apiResponse.responseText = 'Erro ao criar a configuração!';
				apiResponse.statusCode = 500;
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});

	app.get('/config', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const advertiser = req.advertiser;
		const configDAO = new ConfigDAO(advertiser);

		const apiResponse = new ApiResponse();

		configDAO
			.getLastConfig()
			.then((config: Config) => {
				apiResponse.responseText = config.toString();
				apiResponse.statusCode = 200;
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = 'Erro ao recuperar configuração!';
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
};

export default config;
