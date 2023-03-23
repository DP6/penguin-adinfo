import { ApiResponse } from '../models/ApiResponse';
import { UserDAO } from '../models/DAO/UserDAO';
import { User } from '../models/User';

const user = (app: { [key: string]: any }): void => {
	app.get('/users', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		new UserDAO()
			.getAllUsersFrom(req.advertiser)
			.then((users: User[]) => {
				apiResponse.responseText = JSON.stringify(users.map((user: User) => user.toJson()));
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = err.message;
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});

	app.get('/user', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();
		const user = {
			permission: req.permission,
			adOpsTeam: req.adOpsTeam,
			advertiser: req.advertiser,
			email: req.email,
		};
		apiResponse.statusCode = 200;
		apiResponse.responseText = JSON.stringify(user);

		res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
	});

	app.delete('/user/:id/delete', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const targetUserId = req.params.id;
		const userDAO = new UserDAO();

		userDAO
			.getUserById(targetUserId)
			.then((user: User) => {
				if (
					(req.permission === 'adOpsManager' && user.adOpsTeam !== req.adOpsTeam) ||
					(req.permission === 'admin' && user.permission === 'owner')
				)
					throw new Error('Usuário sem permissão');
				return userDAO.deleteUser(targetUserId);
			})
			.then((result: boolean) => {
				if (result) {
					apiResponse.statusCode = 200;
					apiResponse.responseText = 'Usuário deletado com sucesso!';
				} else {
					throw new Error('Erro ao deletar usuário!');
				}
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = err.message;
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});

	app.post('/user/changepass', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		new UserDAO(req.email, req.body.password)
			.getUser()
			.then((user: User) => {
				user.password = req.body.newPassword;
				return new UserDAO().changePassword(user);
			})
			.then((result: boolean) => {
				if (result) {
					apiResponse.statusCode = 200;
					apiResponse.responseText = 'Senha alterada com sucesso!';
				} else {
					throw new Error('Erro ao modificar a senha!');
				}
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = 'Email e/ou senha incorreto(s)!';
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});

	app.post('/user/:id/deactivate', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const targetUserId = req.params.id;

		new UserDAO()
			.deactivateUser(targetUserId, req.permission)
			.then((result: boolean) => {
				if (result) {
					apiResponse.statusCode = 200;
					apiResponse.responseText = 'Usuário desativado com sucesso!';
				} else {
					throw new Error('Erro ao desativar usuário!');
				}
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = 'Email e/ou senha incorreto(s)!';
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});

	app.post('/user/:id/reactivate', (req: { [key: string]: any }, res: { [key: string]: any }) => {
		const apiResponse = new ApiResponse();

		const targetUserId = req.params.id;

		new UserDAO()
			.reactivateUser(targetUserId, req.permission)
			.then((result: boolean) => {
				if (result) {
					apiResponse.statusCode = 200;
					apiResponse.responseText = 'Usuário re-ativado com sucesso!';
				} else {
					throw new Error('Erro ao re-ativar usuário!');
				}
			})
			.catch((err) => {
				apiResponse.statusCode = 500;
				apiResponse.responseText = 'Email e/ou senha incorreto(s)!';
				apiResponse.errorMessage = err.message;
			})
			.finally(() => {
				res.status(apiResponse.statusCode).send(apiResponse.jsonResponse);
			});
	});
};

export default user;
