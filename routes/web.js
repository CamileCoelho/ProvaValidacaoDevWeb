const express = require("express");
const csrf = require('csurf');
const DataBase = require('../database/DataBase');
const webUserController = require("../controllers/WebUserController");
const webAdminController = require("../controllers/WebAdminController");
const session = require("express-session");

const csrfProtection = csrf();
const router = express.Router();

function ensureAuthenticated(req, res, next) {
    console.log(req.session)
    console.log(req.session.user)
    console.log(req.session.admin)

    if (req.session.user) {
        return next();
    } else {
        res.redirect("/login");
    }
}

function ensureAdminAuthenticated(req, res, next) {
    console.log(req.session)
    console.log(req.session.user)
    console.log(req.session.admin)
    
    if (req.session.admin) {
        return next();
    } else {
        res.redirect("/admin/login");
    }
}

router.get("/", async (request, response) => {
    response.render("index", { layout: "layout/main", title: "Index" });
});

// Usuário
router.get("/login", csrfProtection, webUserController.login)
router.get("/register", csrfProtection, webUserController.create);
router.post("/register", csrfProtection, webUserController.store);
router.get("/home", ensureAuthenticated, webUserController.home);
router.post("/login",  csrfProtection, webUserController.logar);
router.get("/logout", webUserController.logout);

// Admin
router.get("/admin/login",  csrfProtection, webAdminController.login)
router.get("/admin", ensureAdminAuthenticated, webAdminController.admin);
router.post("/admin/login",  csrfProtection, webAdminController.logar)
router.get("/admin/logout", webAdminController.logout);

// Teste de conexão com o banco
router.get("/users", async (request, response) => {
    const produtos = await DataBase.executeSQLQuery("SELECT * FROM Users");
    response.send(produtos);
});

module.exports = router;