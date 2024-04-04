const Router = require("express").Router();
const FriendRequestController = require("../controllers/friendRequestController");

Router.get("/get-list-request/:userID", FriendRequestController.getRequestAddFriendOfMe);
Router.get("/get-of-me/:userID", FriendRequestController.getFriendRequestOfMe);

Router.post("/create", FriendRequestController.addFriendRequestController);
Router.post("/friend-request/:friendRequestID", FriendRequestController.friendRequest);

Router.delete("/:friendRequestID", FriendRequestController.deleteFriendRequest);

module.exports = Router;
