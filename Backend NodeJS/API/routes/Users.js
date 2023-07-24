const express = require("express");
const router = express.Router();

const controller = require("../controllers/UserController");

router.get("/", controller.getGreeting);

router.post("/register", controller.createUser);

router.post("/login", controller.authenticateUser);

module.exports = router;