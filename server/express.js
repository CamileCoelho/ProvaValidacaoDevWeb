// Esse arquivo terá a responsabilidade de configurar o servidor express
// O servidor será configurado no objeto app

const HbsConfigureCustomHelpers = require("./HbsConfigureCustomHelpers");
const Crypto = require("crypto");
const express = require('express');
const methodOverride = require("method-override");
const session = require("express-session");
const config = require('config');
const csurf = require('csurf');
const app = express();
const webRoutes = require("../routes/web");

// Configura a chave port dentro do objeto app
app.set("port", process.env.PORT || config.server.port);
// Configura a chave "view engine" dentro do objeto app, que define o render ou "Template Engine" de views utilizando o pacote hbs no express
app.set("view engine", "hbs");
// Configura os CustomHelpers do pacote hbs
HbsConfigureCustomHelpers.run();
// Configura o middleware do Express que analisa dados codificados em URL que são enviados para o servidor.
app.use(express.urlencoded({ extended: false }));
// Configura o method-override no express para poder usar put ou delete nos <form> do HTML
app.use(methodOverride("_method"));
// Configura o middleware de session
app.use(session({
    secret: Crypto.randomBytes(32).toString('hex'), // chave secreta para assinar o cookie da sessão
    resave: false,  // Não salvar a sessão novamente se não houve alteração
    saveUninitialized: false,  // Não salvar uma sessão não inicializada (sem dados)
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Tempo de expiração do cookie em milissegundos (1 dia)
        secure: false,
        httpOnly: true, // O cookie não pode ser acessado via JavaScript
        sameSite: 'strict' 
    }
}));

const csrfProtection = csurf();

app.use(express.urlencoded({ extended: false }));

app.use(csrfProtection)


// Middleware para passar o token CSRF para todas as views
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); // Adiciona o token CSRF ao objeto de resposta
    next();
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      // Token CSRF inválido ou ausente
      res.status(403).send('Formulário com verificação de segurança falhou ou expirou.');
    } else {
      next(err);
    }
  });
  
// Defino aque irá utilizar o arquivo routes/web.js p/ configurar as rotas do tipo WEB
app.use(webRoutes);

app.use((req, res, next) => {
  res.locals.session = req.session; // Torna a sessão acessível nas views
  next();
});

app.get('/session/status', (req, res) => {
  res.json({
      user: req.session.user || false,
      admin: req.session.admin || false
  });
});

module.exports = app;