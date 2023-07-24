const express = require("express");
const router = express.Router();

const controller = require("../controllers/GoalController");

const {amILoggedIn} = require("../middleware/authorization");

router.post("/add", amILoggedIn, controller.createGoal);

router.get("/", controller.getUserGoals);

module.exports = router;