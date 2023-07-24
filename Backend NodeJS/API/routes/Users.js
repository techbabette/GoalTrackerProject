const express = require("express");
const router = express.Router();

const controller = require("../controllers/UserController");

const {amILoggedIn} = require("../middleware/authorization");

router.get("/", controller.getGreeting);

router.post("/register", controller.createUser);

router.post("/login", controller.authenticateUser);

router.get("/check", amILoggedIn, controller.mustBeLoggedIn);

module.exports = router;