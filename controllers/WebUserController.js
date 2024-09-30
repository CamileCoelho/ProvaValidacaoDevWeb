const bcrypt = require("bcrypt");
const { param, body, validationResult } = require("express-validator");
const UserModel = require("../models/UserModel");

class WebUserController {
    /**
         * Mostra um formulário para login
         * @param {*} req Requisição da rota do express
         * @param {*} res Resposta da rota do express
         */
    async login(req, res) {
        return res.render("user/login", {
            layout: "layout/main",
            title: "Login de Usuário"
        });
    }

    /**
     * Mostra um formulário para criação de um novo usuário
     * @param {*} req Requisição da rota do express
     * @param {*} res Resposta da rota do express
     */
    async create(req, res) {
        return res.render("user/register", {
            layout: "layout/main",
            title: "Criar Usuário"
        });
    }

    /**
     * Mostra a home que o usuário pode acessar
     * @param {*} req Requisição da rota do express
     * @param {*} res Resposta da rota do express
     */
    async home(req, res) {
        return res.render("user/home", {
            layout: "layout/main",
            title: "Área do Usuário"
        });
    }

    /**
     * Regras de validação para o store.
     */
    storeValidationRules = [
        body('name').isString().not().isEmpty().withMessage('O nome do usuário deve ser um texto não vazio.'),
        body('email').isEmail().withMessage('O email deve ser um email válido.'),
        body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.')
    ];

    /**
     * Salva um novo usuário no banco de dados
     * @param {*} req Requisição da rota do express
     * @param {*} res Resposta da rota do express
     */
    async store(req, res) {
        try {
            // Verificar se há erros de validação
            const validation = validationResult(req);
            if (!validation.isEmpty()) {
                throw validation;
            }
            const user = new UserModel();
            user.name = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;
            const result = await user.save();
        } catch (error) {
            return res.redirect("/register");
        }
        return res.redirect("/login");
    }

    /**
     * Processa o login do usuário e cria uma sessão.
     * @param {*} req Requisição do express
     * @param {*} res Resposta do express
     */
    async logar(req, res) {
        try {
            const { email, senha } = req.body;

            // Busca o usuário pelo email no banco de dados
            const user = await UserModel.findOneByEmail(email); // Supondo que você tenha um método para buscar por email
            if (!user) {
                throw new Error("Usuário não encontrado.");
            }

            // Compara a senha informada com o hash armazenado
            const match = await bcrypt.compare(senha, user.password);
            if (!match) {
                throw new Error("Senha incorreta.");
            }

            // Salva os dados do usuário na sessão
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            // Redireciona para a área do usuário
            return res.redirect("/home");
        } catch (error) {
            console.error(error);
            req.session.errorMessage = error.message;
            return res.redirect("/login");
        }
    }

    /**
     * Implementa o logout do usuário e destrói a sessão.
     * @param {*} req Requisição do express
     * @param {*} res Resposta do express
     */
    async logout(req, res) {       
        req.session.user = null; 
        return res.redirect("/login");
    }
}

module.exports = new WebUserController();