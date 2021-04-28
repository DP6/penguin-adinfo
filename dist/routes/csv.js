'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const FileDAO_1 = require('../models/DAO/FileDAO');
const DateUtils_1 = require('../utils/DateUtils');
const csv = (app) => {
	app.post('/csv', (req, res) => {
		const content = req.files.data.data;
		const agency = req.agency;
		const filePath = `${agency}/${DateUtils_1.DateUtils.generateDateString()}.csv`;
		const fileDAO = new FileDAO_1.FileDAO();
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
	app.get('/csv', (req, res) => {
		const fileName = req.headers.file;
		const agency = req.agency;
		if (!fileName) {
			res.status(400).send({
				message: 'Nenhum arquivo foi enviado!',
			});
			return;
		}
		const filePath = `${agency}/${fileName}.csv`;
		const fileDAO = new FileDAO_1.FileDAO();
		fileDAO
			.getFromStore(filePath)
			.then((data) => {
				res.status(200).send(data.toString());
			})
			.catch((err) => {
				res.status(500).send(`Falha ao restaurar o arquivo ${fileName}!`);
			});
	});
	app.get('/csv/list', (req, res) => {
		const agency = req.agency;
		const fileDAO = new FileDAO_1.FileDAO();
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
exports.default = csv;
