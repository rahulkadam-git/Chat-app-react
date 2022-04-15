const router = require("express").Router();
const controller = require("../controller/chat.controller");
const { protect } = require("../Middleware/auth.Middleware");

router.post("/chat", protect, controller.accessChat);
router.get("/chat", protect, controller.fetchChat);
router.post("/group", protect, controller.createGroupChat);
router.put("/rename", protect, controller.renameGroupChat);
router.put("/remove", protect, controller.removeFromChat);
router.put("/groupadd", protect, controller.addToGroupChat);

module.exports = router;
