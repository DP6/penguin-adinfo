// import { CampaignDAO } from '../models/DAO/CampaignDAO';
import { ApiResponse } from '../models/ApiResponse';
// imports para testes
import { FirestoreConnectionSingleton } from '../models/cloud/FirestoreConnectionSingleton';
import { FileDAO } from '../models/DAO/FileDAO';
import { StorageConnectionSingleton } from '../models/cloud/StorageConnectionSingleton';
import { CollectionReference, DocumentReference, Firestore, DocumentData } from '@google-cloud/firestore';

const campaign = (app: { [key: string]: any }): void => {
	app.get('/campaign/list', async (req: { [key: string]: any }, res: { [key: string]: any }) => {
		console.log(
			'#################################################### to vivo ####################################################'
		);

		// testes

		const firestore = new Firestore();
		const collection = firestore.collection('campaigns');

		console.log(collection.doc());

		// let firestoreConnection = new FirestoreConnectionSingleton()
		// console.log(req)

		const fileDAO = new FileDAO();

		// let [files] = await fileDAO.getAllFilesFromStore('empresa1/topster/toper') // companhia / agencia / campanha

		// console.log(files)

		// let arquivos = Object.values(files)

		// console.log(Object.values(arquivos[0])[3].selfLink)

		// console.log(typeof(files))

		// let [campaigns] = await fileDAO.getAllFilesFromStore('empresa1/topster')

		// console.log(campaigns)

		// quando for para prod

		// const apiResponse = new ApiResponse();
		// const user = {
		// 	permission: req.permission,
		// 	agency: req.agency,
		// 	company: req.company,
		// 	email: req.email,
		// }

		// if(user.agency){
		//     let [campaignsFinal] = await fileDAO.getAllFilesFromStore(`${user.company}/${user.agency}`)
		// } else {
		//     let [campaignsFinal] = await fileDAO.getAllFilesFromStore(`${user.company}/CompayCampaigns`)
		// }

		// apiResponse.statusCode = 200;
		// apiResponse.responseText = JSON.stringify(user);
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

		const values = {
			created: `${year}-${month}-${day}`,
			company: req.company,
			agency: req.agency,
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
				firestoreConnectionInstance.addDocumentIn(collection, values, 'Campanha Teste'); // onde eu pego o nome da campanha que a pessoa inserir? talvez seja algum parametro do body?
			})
			.catch((message) => {
				throw message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
};

export default campaign;
