'use strict';
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
Object.defineProperty(exports, '__esModule', { value: true });
const ApiResponse_1 = require('../models/ApiResponse');
const FirestoreConnectionSingleton_1 = require('../models/cloud/FirestoreConnectionSingleton');
const FileDAO_1 = require('../models/DAO/FileDAO');
const firestore_1 = require('@google-cloud/firestore');
const campaign = (app) => {
	app.get('/campaign/list', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			console.log(
				'#################################################### to vivo ####################################################'
			);
			const firestore = new firestore_1.Firestore();
			const collection = firestore.collection('campaigns');
			console.log(collection.doc());
			const fileDAO = new FileDAO_1.FileDAO();
		})
	);
	app.post('/campaign/add', (req, res) =>
		__awaiter(void 0, void 0, void 0, function* () {
			const apiResponse = new ApiResponse_1.ApiResponse();
			const firestore = new firestore_1.Firestore();
			const collection = firestore.collection('campaigns');
			const firestoreConnectionInstance = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
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
					firestoreConnectionInstance.addDocumentIn(collection, values, 'Campanha Teste');
				})
				.catch((message) => {
					throw message;
				})
				.finally(() => {
					res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
				});
		})
	);
};
exports.default = campaign;
