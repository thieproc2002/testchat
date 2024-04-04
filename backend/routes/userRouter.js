const express = require('express');
const Router = express.Router();
const UserController = require('../controllers/userController');

Router.get('/',UserController.getAllUsers);
Router.get('/admin',UserController.getAllUserForAdmin);

Router.get('/get-friends-user/:userId',UserController.getAllFriendsUserByUserID);
Router.get('/get-user-by-phone/:phoneNumber',UserController.getUserByPhoneNumber);

Router.post('/delete-friend/:userId',UserController.deleteFriend);
Router.post('/update-avatar/:userId',UserController.updateAvar);
Router.post('/update-background/:userId',UserController.updateBack);

Router
    .route('/:userID')
    .get(UserController.getUserByID)
    .put(UserController.updateUserText)

module.exports = Router;