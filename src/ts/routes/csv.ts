import { FileDAO } from '../models/DAO/FileDAO';
import { DateUtils } from '../utils/DateUtils';

const csv = (app: { [key: string]: any }): void => {
	app.post('/csv', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const campaign = req.headers.campaign;
		const content = req.files.data.data;
		const agency = req.agency;
		const company = req.company;

		if (!campaign) {
			res.status(400).send({
				message: 'Nenhuma campanha foi informada!',
			});
		}

		const filePath = agency
			? `${company}/${agency}/${campaign}/${DateUtils.generateDateString()}.csv`
			: `${company}/${campaign}/${DateUtils.generateDateString()}.csv`;

		const fileDAO = new FileDAO();
		fileDAO.file = content;
		fileDAO
			.save(filePath)
			.then(() => {
				res.status(200).send('Arquivo salvo com sucesso!');
			})
			.catch((err) => {
				res.status(500).send('Falha ao salvar arquivo!');
			});
	});

	app.get('/csv', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const fileName = req.headers.file;
		const agency = req.agency;
		const campaign = req.headers.campaign;
		const company = req.company;

		if (!fileName) {
			res.status(400).send({
				message: 'Nenhum arquivo foi enviado!',
			});
			return;
		} else if (!campaign) {
			res.status(400).send({
				message: 'Nenhuma campanha foi informada!',
			});
		}

		const filePath = agency
			? `${company}/${agency}/${campaign}/${fileName}.csv`
			: `${company}/${campaign}/${fileName}.csv`;

		const fileDAO = new FileDAO();
		fileDAO
			.getFromStore(filePath)
			.then((data) => {
				// const dataFormated = data[0].toString("utf8");
				res.status(200).send(data.toString());
			})
			.catch((err) => {
				res.status(500).send(`Falha ao restaurar o arquivo ${fileName}!`);
			});
	});

	app.get('/csv/list', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const agency = req.agency;
		const company = req.company;
		const campaign = req.headers.campaign;
		const fileDAO = new FileDAO();

		let filePath = `${company}/`;

		if (agency) filePath += `${agency}/`;
		if (campaign) filePath += `${campaign}/`;

		fileDAO
			.getAllFilesFromStore(filePath)
			.then((data) => {
				const files = data[0].filter((file) => /\.csv$/.test(file.name)).map((file) => file.name);
				res.status(200).send(files);
			})
			.catch((err) => {
				res.status(500).send(`Falha ao restaurar os arquivos!`);
			});
	});
};

export default csv;
