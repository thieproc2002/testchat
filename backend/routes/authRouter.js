const express = require('express');
const Router = express.Router();
const AuthController = require('../controllers/authController');

Router.post('/login', AuthController.login);
Router.post('/signup', AuthController.signup);

module.exports = Router;