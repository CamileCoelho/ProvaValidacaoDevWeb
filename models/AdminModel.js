const DataBase = require("../database/DataBase");

class AdminModel {
    id = null;
    name = null;
    email = null;
    email_verified_at = null;
    password = null;
    remember_token = null;
    updated_at = null;
    created_at = null;

    /**
     * Construtor da Classe AdminModel
     * @param {Admin} admin O objeto de entrada deve conter as seguintes chaves: id, name, email, email_verified_at, password, remember_token, updated_at, created_at.
     * Caso não passe um objeto com esses campos, um model vazio será criado.
     */
    constructor(admin) {
        if (admin &&
            "id" in admin &&
            "name" in admin &&
            "email" in admin &&
            "email_verified_at" in admin &&
            "password" in admin &&
            "remember_token" in admin &&
            "updated_at" in admin &&
            "created_at" in admin) {
            this.id = admin.id;
            this.name = admin.name;
            this.email = admin.email;
            this.email_verified_at = admin.email_verified_at;
            this.password = admin.password;
            this.remember_token = admin.remember_token;
            this.updated_at = admin.updated_at;
            this.created_at = admin.created_at;
        }
    }

    /**
     * Busca um objeto AdminModel no banco de dados
     * @param  {Number} id ID do admin a ser procurado no banco de dados.
     * @return {AdminModel} Retorna um objeto AdminModel com as informações encontradas, caso não encontre, retorna null.
     */
    static async findOne(id) {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Admins WHERE Admins.id = ?`, [id]);
        if (result && result.length == 1) return new AdminModel(result[0]);
        return null;
    }

    /**
     * Busca um objeto UserModel no banco de dados pelo email.
     * @param {String} email Email do usuário a ser procurado no banco de dados.
     * @return {AdminModel} Retorna um objeto UserModel com as informações encontradas, caso não encontre, retorna null.
     */
    static async findOneByEmail(email) {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Admins WHERE Admins.email = ?`, [email]);
        if (result && result.length === 1) {
            return new AdminModel(result[0]);
        }
        return null;
    }
}

module.exports = AdminModel;
