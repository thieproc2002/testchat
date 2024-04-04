const Router = require("express").Router();
const MessagesController = require("../controllers/messageController");

Router.get("/:conversationId",MessagesController.getAllMessageInConversationID);
Router.get("/recall/:messageId", MessagesController.recallMessage);

Router.post("/ten-last-messages/:conversationId",MessagesController.getTenLastMessageInConversationID);
Router.post("/", MessagesController.createMessageManyFile);
Router.post("/move-message/:messageId", MessagesController.moveMessage);
Router.post("/update-seen/:messageId", MessagesController.updateSeen);

Router.delete("/delete-for-you/:messageId",MessagesController.deleteMessageForYou);
Router.delete("/:messageId", MessagesController.deleteMessage);

module.exports = Router;
