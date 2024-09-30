const mysql2 = require("mysql2/promise");

class DataBase {

    /**
    * Abre uma conexão com o Banco de Dados, realiza uma consulta e depois fecha a conexão.
    * @param {String}               sql     SQL para ser executado no Banco de Dados.
    * @param {[any, ...any]}        params  Array de parâmetros que serão substituidos pelos ? na consulta SQL.
    * @return {[Object, ...Object]}         Retorna um objeto Array com os objetos encontrados ou o resultado de uma operação (REMOVE, UPDATE), [ ] caso não encontre nada
    */
    static async executeSQLQuery(sql, params) {
        const connection = await mysql2.createConnection({
            host: "localhost",
            database: "RestauranteDB",
            user: "root",
            password: ""
        });
        const [rows] = await connection.execute(sql, params);
        connection.end();
        return rows;
    }

};

module.exports = DataBase;

