'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const FileDAO_1 = require('../models/DAO/FileDAO');
const DateUtils_1 = require('../utils/DateUtils');
const csv = (app) => {
	app.post('/csv', (req, res) => {
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
			? `${company}/${agency}/${campaign}/${DateUtils_1.DateUtils.generateDateString()}.csv`
			: `${company}/${campaign}/${DateUtils_1.DateUtils.generateDateString()}.csv`;
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
		const company = req.company;
		const campaign = req.headers.campaign;
		const fileDAO = new FileDAO_1.FileDAO();
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
exports.default = csv;
