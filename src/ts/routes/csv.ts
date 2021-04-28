import { FileDAO } from '../models/DAO/FileDAO';
import { DateUtils } from '../utils/DateUtils';

const csv = (app: { [key: string]: any }): void => {
	app.post('/csv', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const content = req.files.data.data;
		const agency = req.agency;
		const filePath = `${agency}/${DateUtils.generateDateString()}.csv`;
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
		if (!fileName) {
			res.status(400).send({
				message: 'Nenhum arquivo foi enviado!',
			});
			return;
		}
		const filePath = `${agency}/${fileName}.csv`;
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
		const fileDAO = new FileDAO();
		fileDAO
			.getAllFilesFromStore(agency)
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
