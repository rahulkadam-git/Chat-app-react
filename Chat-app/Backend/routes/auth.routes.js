const router = require("express").Router();
const controller = require("../controller/auth.controller")
const {protect} = require("../Middleware/auth.Middleware")

router.post("/register", controller.registerUser);
router.post("/login",controller.login);
router.get("/allusers",protect,controller.allUsers);


module.exports = router;