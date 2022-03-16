"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDAO = void 0;
const FirestoreConnectionSingleton_1 = require("../cloud/FirestoreConnectionSingleton");
const User_1 = require("../User");
const bcrypt = require("bcrypt");
class UserDAO {
    constructor(email, password) {
        this._email = email;
        this._password = password;
        this._objectStore = FirestoreConnectionSingleton_1.FirestoreConnectionSingleton.getInstance();
        this._pathToCollection = ['tokens'];
        this._authCollection = this._objectStore.getCollection(this._pathToCollection);
    }
    getUserId() {
        return this._objectStore
            .getCollection(this._pathToCollection)
            .where('email', '==', this._email)
            .get()
            .then((querySnapshot) => {
            if (querySnapshot.size > 0) {
                querySnapshot.forEach((documentSnapshot) => {
                    const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
                    const validatePassword = bcrypt.compareSync(this._password, documentSnapshot.get('password'));
                    if (!validatePassword)
                        throw new Error('Email ou senha incorreto(s)!');
                    if (searchId) {
                        return searchId[0];
                    }
                    else {
                        throw new Error('Falha ao recuperar o ID do usuário');
                    }
                });
            }
            else {
                throw new Error('ID não encontrado!');
            }
        })
            .catch((err) => {
            throw err;
        });
    }
    getAllUsersFrom(company, userRequestPermission) {
        return this._objectStore
            .getCollection(this._pathToCollection)
            .where('company', '==', company)
            .get()
            .then((querySnapshot) => {
            if (querySnapshot.size > 0) {
                const users = [];
                querySnapshot.forEach((documentSnapshot) => {
                    const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
                    if (searchId) {
                        const userPermission = documentSnapshot.get('permission');
                        if (userPermission !== 'owner' || (userRequestPermission === 'admin' && userPermission === 'user')) {
                            const user = new User_1.User(searchId[0], userPermission, documentSnapshot.get('company'), documentSnapshot.get('email'), documentSnapshot.get('active'), documentSnapshot.get('adOpsTeam'));
                            users.push(user);
                        }
                    }
                    else {
                        throw new Error('Nenhum usuário encontrado!');
                    }
                });
                return users;
            }
        })
            .catch((err) => {
            throw err;
        });
    }
    getUser() {
        return this._objectStore
            .getCollection(this._pathToCollection)
            .where('email', '==', this._email)
            .get()
            .then((querySnapshot) => {
            console.log('entrei no then do get user');
            if (querySnapshot.size > 0) {
                let user;
                querySnapshot.forEach((documentSnapshot) => {
                    const searchId = documentSnapshot.ref.path.match(new RegExp('[^/]+$'));
                    if (searchId) {
                        console.log('to no if pq encontrei o user', 'senha que peguei aqui do request ', this._password, 'senha do pessword do firestore', documentSnapshot.get('password'));
                        const validatePassword = bcrypt.compareSync(this._password, documentSnapshot.get('password'));
                        console.log('validate password oq retorna: ', validatePassword);
                        if (!validatePassword)
                            throw new Error('Email ou senha incorreto(s)!');
                        console.log('passei do throw error pq deu true');
                        user = new User_1.User(searchId[0], documentSnapshot.get('permission'), documentSnapshot.get('company'), documentSnapshot.get('email'), documentSnapshot.get('active'), documentSnapshot.get('adOpsTeam'));
                        console.log('objeto do user', user);
                    }
                    else {
                        throw new Error('Nenhum usuário encontrado!');
                    }
                });
                return user;
            }
            else {
                console.log('erro no getUser()');
                throw new Error('Email ou senha incorreto(s)!');
            }
        })
            .catch((err) => {
            throw err;
        });
    }
    addUser(user) {
        return this._objectStore
            .addDocumentIn(this._authCollection, user.toJsonSave(), '')
            .get()
            .then((data) => {
            return data.id;
        })
            .catch((err) => console.log(err));
    }
    changePassword(user) {
        return this._objectStore
            .getCollection(this._pathToCollection)
            .doc(user.id)
            .get()
            .then((doc) => {
            return doc.ref.set(user.toJsonSave());
        })
            .then(() => {
            return true;
        })
            .catch((err) => {
            throw err;
        });
    }
    deactivateUser(userId, userRequestPermission) {
        return this._objectStore
            .getCollection(this._pathToCollection)
            .doc(userId)
            .get()
            .then((doc) => {
            const user = doc.data();
            if (user.permission === 'user' ||
                ((user.permission === 'admin' || user.permission === 'adOpsManager') && userRequestPermission === 'owner')) {
                user.active = false;
            }
            else if (user.permission === 'adOpsManager' && userRequestPermission === 'admin') {
                user.active = false;
            }
            else {
                throw new Error('Permissões insuficientes para inavitar o usuário!');
            }
            return doc.ref.set(user);
        })
            .then(() => {
            return true;
        })
            .catch((err) => {
            throw err;
        });
    }
    reactivateUser(userId, userRequestPermission) {
        return this._objectStore
            .getCollection(this._pathToCollection)
            .doc(userId)
            .get()
            .then((doc) => {
            const user = doc.data();
            if (user.permission === 'user' ||
                ((user.permission === 'admin' || user.permission === 'adOpsManager') && userRequestPermission === 'owner')) {
                user.active = true;
            }
            else if (user.permission === 'adOpsManager' && userRequestPermission === 'admin') {
                user.active = true;
            }
            else {
                throw new Error('Permissões insuficientes para inavitar o usuário!');
            }
            return doc.ref.set(user);
        })
            .then(() => {
            return true;
        })
            .catch((err) => {
            throw err;
        });
    }
}
exports.UserDAO = UserDAO;
