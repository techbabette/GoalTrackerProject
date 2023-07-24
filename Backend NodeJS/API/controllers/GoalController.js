let GoalModel = require("../models/Goal.js");
let BaseController =  require("./BaseController.js");

class GoalController extends BaseController  {
    static async createGoal (req, res)  {
        let {name, unit, repeats, desiredRepeats, startDate, desiredEndDate} = req.body;

        let userId = GoalController.getUserIdFromToken(req);

        //Creates a new goal for the submitting user, attemptExecution wraps the function in a try catch block
        GoalController.attemptExecution(async()=>{
            let newGoal = await GoalModel.create({userId, name, unit, repeats, desiredRepeats, desiredEndDate, startDate});
            res.json(newGoal);
        })
    }
    static async getUserGoals (req, res) {
        let userId = GoalController.getUserIdFromToken(req);

        let searchParams = {userId};

        if(req.body.onlyCompleted){
            searchParams.dateCompleted = {$exists:true}
        }

        if(req.body.onlyUncompleted){
            searchParams.dateCompleted = {$exists:false};
        }

        //Returns the user's goals, attemptExecution wraps the function in a try catch block
        GoalController.attemptExecution(async()=>{
            let userGoals = await GoalModel.find(searchParams);
            res.status(200);
            res.json({message : "Successfully retrieved goals", data : userGoals})
        })
    }
};

module.exports = GoalController;