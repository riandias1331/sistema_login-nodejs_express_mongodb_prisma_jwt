const express = require("express");
const router = express.Router();
const Controller = require("./src/controllers/Controller.js"); 
const auth = require("./src/middlwares/auth.js"); 

// Rotas privadas (requerem autenticação)
router.get("/users", auth, Controller.getUsers); 

// Rotas públicas
router.get("/", Controller.renderHome);
router.get("/login", Controller.getlogin);
router.get("/register", Controller.getregister);
router.post("/register", Controller.register); 
router.post("/login", Controller.login);

module.exports = router;