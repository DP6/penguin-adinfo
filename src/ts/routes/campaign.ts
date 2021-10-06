// import { CampaignDAO } from '../models/DAO/CampaignDAO';
import { ApiResponse } from '../models/ApiResponse';
import { FirestoreConnectionSingleton } from '../models/cloud/FirestoreConnectionSingleton';
import { FileDAO } from '../models/DAO/FileDAO';
import { Firestore } from '@google-cloud/firestore';

const campaign = (app: { [key: string]: any }): void => {
	app.get('/campaign/list', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		console.log(
			'#################################################### to vivo ####################################################'
		);
		const apiResponse = new ApiResponse();
		console.log(req.headers);

		const agency = req.agency ? req.agency : 'CompanyCampaigns';
		const company = req.company;
		const campaign = req.headers.campaign;
		const fileDAO = new FileDAO();

		let filePath = `${company}/${agency}/`;

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

	app.post('/campaign/add', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const firestore = new Firestore();
		const collection = firestore.collection('campaigns');

		const firestoreConnectionInstance = FirestoreConnectionSingleton.getInstance();

		const today = new Date();
		const day = String(today.getDate()).padStart(2, '0');
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const year = today.getFullYear();

		const campaign = req.headers.campaign; //confirmar

		const values = {
			created: `${year}-${month}-${day}`,
			company: req.company,
			agency: req.agency ? req.agency : 'CompanyCampaigns',
			activated: true,
		};

		new Promise((resolve, reject) => {
			if (values) {
				apiResponse.responseText = JSON.stringify(values);
				apiResponse.statusCode = 200;
				resolve('Campanha criada');
			} else {
				apiResponse.statusCode = 400;
				apiResponse.responseText = JSON.stringify(values);
				reject('Criação da campanha falhou!');
			}
		})
			.then(() => {
				firestoreConnectionInstance.addDocumentIn(collection, values, campaign); // onde eu pego o nome da campanha que a pessoa inserir? talvez seja algum parametro do body? eh o headers.campaign mesmo?
			})
			.catch((message) => {
				throw message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});

	app.get('/campaign/teste', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		res.status(apiResponse.statusCode).send(req);
	});

	app.post('/user/:id/deactivate', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const targetUserId = req.params.id;

		// new UserDAO()
		// 	.deactivateUser(targetUserId, req.permission)
		// 	.then((result: boolean) => {
		// 		if (result) {
		// 			apiResponse.statusCode = 200;
		// 			apiResponse.responseText = 'Usuário desativado com sucesso!';
		// 		} else {
		// 			throw new Error('Erro ao desativar usuário!');
		// 		}
		// 	})
		// 	.catch((err) => {
		// 		apiResponse.statusCode = 500;
		// 		apiResponse.responseText = 'Email e/ou senha incorreto(s)!';
		// 		apiResponse.errorMessage = err.message;
		// 	})
		// 	.finally(() => {
		// 		res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
		// 	});
	});

	app.post('/user/:id/reactivate', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const targetUserId = req.params.id;

		// new UserDAO()
		// 	.reactivateUser(targetUserId, req.permission)
		// 	.then((result: boolean) => {
		// 		if (result) {
		// 			apiResponse.statusCode = 200;
		// 			apiResponse.responseText = 'Usuário re-ativado com sucesso!';
		// 		} else {
		// 			throw new Error('Erro ao re-ativar usuário!');
		// 		}
		// 	})
		// 	.catch((err) => {
		// 		apiResponse.statusCode = 500;
		// 		apiResponse.responseText = 'Email e/ou senha incorreto(s)!';
		// 		apiResponse.errorMessage = err.message;
		// 	})
		// 	.finally(() => {
		// 		res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
		// 	});
	});
};

export default campaign;
