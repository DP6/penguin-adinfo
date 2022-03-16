import { FileDAO } from '../models/DAO/FileDAO';
import { DateUtils } from '../utils/DateUtils';
import { ApiResponse } from '../models/ApiResponse';

const csv = (app: { [key: string]: any }): void => {
	app.post('/csv', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const campaign = req.headers.campaign;
		const getAllAdOpsTeamsFrom = req.getAllAdOpsTeamsFrom;
		const company = req.company;

		const apiResponse = new ApiResponse();

		if (!campaign) {
			apiResponse.responseText = 'Nenhuma campanha foi informada!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		} else if (!req.files || !req.files.data) {
			apiResponse.responseText = 'Nenhum arquivo foi enviado!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		}

		const content = req.files.data.data;

		const filePath = getAllAdOpsTeamsFrom
			? `${company}/${getAllAdOpsTeamsFrom}/${campaign}/${DateUtils.generateDateString()}.csv`
			: `${company}/${campaign}/${DateUtils.generateDateString()}.csv`;

		const fileDAO = new FileDAO();
		fileDAO.file = content;
		fileDAO
			.save(filePath)
			.then(() => {
				apiResponse.responseText = 'Arquivo salvo com sucesso!';
				apiResponse.statusCode = 200;
			})
			.catch((err) => {
				apiResponse.responseText = 'Falha ao salvar arquivo!';
				apiResponse.statusCode = 500;
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});

	app.get('/csv', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const fileName = req.headers.file;
		const campaign = req.headers.campaign;
		const company = req.company;
		const adOpsTeamPath = req.headers.getAllAdOpsTeamsFrom ? req.headers.getAllAdOpsTeamsFrom : 'CompanyCampaigns';
		const apiResponse = new ApiResponse();

		if (!fileName) {
			apiResponse.responseText = 'Nenhum arquivo foi informado!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		} else if (!campaign) {
			apiResponse.responseText = 'Nenhuma campanha foi informada!';
			apiResponse.statusCode = 400;
			res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			return;
		}
		const filePath = `${company}/${adOpsTeamPath}/${campaign}/${fileName}.csv`;

		const fileDAO = new FileDAO();
		fileDAO
			.getFromStore(filePath)
			.then((file) => {
				// const dataFormated = data[0].toString("utf8");
				res.setHeader('Content-disposition', 'attachment; filename=template.csv');
				res.set('Content-Type', 'text/csv; charset=utf-8');
				apiResponse.statusCode = 200;
				apiResponse.responseText = file.toString();
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = `Falha ao restaurar o arquivo ${fileName}!`;
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

	app.get('/csv/list', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const getAllAdOpsTeamsFrom = req.getAllAdOpsTeamsFrom;
		const company = req.company;
		const campaign = req.headers.campaign;
		const fileDAO = new FileDAO();

		let filePath = `${company}/`;

		const apiResponse = new ApiResponse();

		if (getAllAdOpsTeamsFrom) filePath += `${getAllAdOpsTeamsFrom}/`;
		if (campaign) filePath += `${campaign}/`;

		fileDAO
			.getAllFilesFromStore(filePath)
			.then((data) => {
				const files = data[0].filter((file) => /\.csv$/.test(file.name)).map((file) => file.name);
				apiResponse.responseText = files.join(',');
				apiResponse.statusCode = 200;
			})
			.catch((err) => {
				apiResponse.errorMessage = err.message;
				apiResponse.responseText = `Falha ao restaurar os arquivos!`;
				apiResponse.statusCode = 500;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
};

export default csv;
