const Router = require("express").Router();
const AccountController = require("../controllers/accountController");

Router.get("/", AccountController.getAllAccount);
Router.get("/:phoneNumber", AccountController.getAccountByPhoneNumber);
Router.get("/:accountID", AccountController.getAccountById);

Router.post("/forget-password", AccountController.forgetPassWord);

Router.put("/change-password/:userId", AccountController.changePassWord);


module.exports = Router;
