const router = require("express").Router();
const controller = require("../controller/msg.controller")
const { protect } = require("../Middleware/auth.Middleware");

router.post("/", protect,controller.sendMessage);
router.get("/:chatId",protect,controller.allMessages);



module.exports = router;

