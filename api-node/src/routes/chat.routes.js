const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/authMiddleware");

// =======================
// ROUTES CHAT (JWT)
// =======================

router.get("/messages", authMiddleware, chatController.getMessages);

router.post("/messages", authMiddleware, chatController.sendMessage);

router.delete(
  "/messages/:id",
  authMiddleware,
  chatController.deleteMessage
);

module.exports = router;
