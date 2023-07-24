const express = require("express");
const router = express.Router();

const controller = require("../controllers/ProgressController");

const {amILoggedIn} = require("../middleware/authorization");

router.post("/add", amILoggedIn, controller.addProgress);

router.get("/", amILoggedIn, controller.getUserProgress);

module.exports = router;