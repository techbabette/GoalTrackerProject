const express = require("express");
const router = express.Router();

const controller = require("../controllers/GoalController");

const {amILoggedIn} = require("../middleware/authorization");

router.post("/add", amILoggedIn, controller.createGoal);

router.put("/edit", amILoggedIn, controller.editGoal);

router.delete("/remove", amILoggedIn, controller.removeGoal);

router.get("/", amILoggedIn, controller.getUserGoals);

module.exports = router;