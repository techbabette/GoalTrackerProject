const express = require("express");
const router = express.Router();

const controller = require("../controllers/UserController");

const {amILoggedIn} = require("../middleware/authorization");

router.get("/", controller.getGreeting);

router.post("/register", controller.createUser);

router.get("/activate/:activationHash", controller.activateUser);

router.post("/login", controller.authenticateUser);

router.post("/login/:passwordHash", controller.submitPasswordReset);

router.post("/resetpassword", controller.startPasswordReset);

router.get("/check", amILoggedIn, controller.mustBeLoggedIn);

router.get("/returning", controller.getUserInformation);

module.exports = router;