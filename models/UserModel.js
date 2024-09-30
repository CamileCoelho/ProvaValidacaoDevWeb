const DataBase = require("../database/DataBase");
const bcrypt = require("bcrypt");

class UserModel {
    id = null;
    name = null;
    email = null;
    email_verified_at = null;
    password = null;
    remember_token = null;
    updated_at = null;
    created_at = null;

    /**
     * Construtor da Classe UserModel
     * @param {User} user O objeto de entrada é simples (precisa conter apenas chave e valor, sem métodos) e precisa conter as chaves: id, name, email, email_verified_at, password, remember_token, updated_at e created_at.
     * Caso não passe um objeto com esses campos, um model vazio será criado.
     */
    constructor(user) {
        if (user &&
            "id" in user &&
            "name" in user &&
            "email" in user &&
            "email_verified_at" in user &&
            "password" in user &&
            "remember_token" in user &&
            "updated_at" in user &&
            "created_at" in user) {
            this.id = user.id;
            this.name = user.name;
            this.email = user.email;
            this.email_verified_at = user.email_verified_at;
            this.password = user.password;
            this.remember_token = user.remember_token;
            this.updated_at = user.updated_at;
            this.created_at = user.created_at;
        }
    }

    /**
     * Busca um objeto UserModel no banco de dados
     * @param  {Number} id ID do usuário a ser procurado no banco de dados.
     * @return {UserModel} Retorna um objeto UserModel com as informações encontradas, caso não encontre, retorna null.
     */
    static async findOne(id) {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Users WHERE Users.id = ?`, [id]);
        if (result && result.length == 1)
            return new UserModel(result[0]);
        return null;
    }

    /**
     * Busca um objeto UserModel no banco de dados pelo email.
     * @param {String} email Email do usuário a ser procurado no banco de dados.
     * @return {UserModel} Retorna um objeto UserModel com as informações encontradas, caso não encontre, retorna null.
     */
    static async findOneByEmail(email) {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Users WHERE Users.email = ?`, [email]);
        if (result && result.length === 1) {
            return new UserModel(result[0]);
        }
        return null;
    }

    /**
     * Salva um novo usuário no banco de dados com senha criptografada.
     * @returns {UserModel} Retorna um objeto UserModel com as informações recém inseridas no banco de dados.
     */
    async save() {
        const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

        // Gerar hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
    
        const result = await DataBase.executeSQLQuery(
            `INSERT INTO Users VALUES (null, ?, ?, ?, ?, ?, ?, ?);`,
            [
                this.name,
                this.email,
                this.email_verified_at,
                hashedPassword, // Salvar senha criptografada
                this.remember_token,
                timestamp,
                timestamp,
            ]
        );

        const user = await DataBase.executeSQLQuery(`SELECT * FROM Users WHERE Users.id = ?`, [result.insertId]);
        return new UserModel(user[0]);
    }
}

module.exports = UserModel;
