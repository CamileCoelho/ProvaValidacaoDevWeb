const bcrypt = require("bcrypt");
const { param, body, validationResult } = require("express-validator");
const AdminModel = require("../models/AdminModel");

class WebAdminController {
  /**
       * Mostra um formulário para login
       * @param {*} req Requisição da rota do express
       * @param {*} res Resposta da rota do express
       */
  async login(req, res) {
    return res.render("admin/login", {
      layout: "layout/main",
      title: "Login de Admin"
    });
  }

  /**
   * Mostra a home que o usuário pode acessar
   * @param {*} req Requisição da rota do express
   * @param {*} res Resposta da rota do express
   */
  async admin(req, res) {
    return res.render("admin/admin", {
      layout: "layout/main",
      title: "Área do Admin"
    });
  }

  /**
   * Processa o login do usuário e cria uma sessão.
   * @param {*} req Requisição do express
   * @param {*} res Resposta do express
   */
  async logar(req, res) {
    try {
      const { email, password } = req.body;

      const admin = await AdminModel.findOneByEmail(email); 
      if (!admin) {
        throw new Error("Usuário não encontrado.");
      }

      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        throw new Error("Senha incorreta.");
      }
      
      req.session.admin = {
        id: admin.id,
        name: admin.name,
        email: admin.email
      };

      return res.redirect("/admin");
    } catch (error) {
      console.error(error);
      req.session.errorMessage = error.message;
      return res.redirect("/admin/login");
    }
  }

  /**
   * Implementa o logout do usuário e destrói a sessão.
   * @param {*} req Requisição do express
   * @param {*} res Resposta do express
   */
  async logout(req, res) {
    req.session.admin = null; 
    return res.redirect("/admin/login");
  }
}

module.exports = new WebAdminController();
