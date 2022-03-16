import { ConfigDAO } from '../models/DAO/ConfigDAO';
import { ApiResponse } from '../models/ApiResponse';
import { Config } from '../models/Config';
import { TemplateExcel } from '../models/TemplateExcel';

const template = (app: { [key: string]: any }): void => {
	app.get('/template', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const advertiser = req.advertiser;
		const configDAO = new ConfigDAO(advertiser);

		const apiResponse = new ApiResponse();

		configDAO
			.getLastConfig()
			.then((config: Config) => {
				res.setHeader('Content-disposition', 'attachment; filename=template.csv');
				res.set('Content-Type', 'text/csv; charset=utf-8');
				apiResponse.statusCode = 200;
				apiResponse.responseText = config.toCsvTemplate();
			})
			.catch((err) => {
				apiResponse.responseText = 'Erro ao recuperar a configuração!';
				apiResponse.statusCode = 500;
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				if (apiResponse.statusCode === 200) {
					res.status(apiResponse.statusCode).send(apiResponse.responseText);
				} else {
					res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				}
			});
	});

	app.get('/template/excel', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const advertiser = req.advertiser;
		const configDAO = new ConfigDAO(advertiser);
		const apiResponse = new ApiResponse();
		configDAO
			.getLastConfig()
			.then((config: Config) => {
				const templateExcel = new TemplateExcel(config);
				templateExcel
					.getExcelBuffer()
					.then((buffer: Buffer) => {
						apiResponse.statusCode = 200;
						res.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
						res.attachment('template.xlsx');
						res.send(buffer);
					})
					.catch((err) => {
						apiResponse.responseText = 'Erro ao baixar o template!';
						apiResponse.statusCode = 500;
						apiResponse.errorMessage = err.message;
						res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
					});
			})
			.catch((err) => {
				apiResponse.responseText = 'Erro ao recuperar a configuração!';
				apiResponse.statusCode = 500;
				apiResponse.errorMessage = err.message;
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
};

export default template;
