let GoalModel = require("../models/Goal.js");
let BaseController =  require("./BaseController.js");

class GoalController extends BaseController  {
    static async createGoal (req, res)  {
        let {name, unit, repeats, desiredRepeats, startDate, desiredEndDate} = req.body;

        let userId = GoalController.getUserIdFromToken(req);

        try{
            let newGoal = await GoalModel.create({userId, name, unit, repeats, desiredRepeats, desiredEndDate, startDate});
            res.json(newGoal);
        }
        catch(ex){
            res.status(500);
            console.log(ex);
            res.json({error: "Unknown server error"});
        }
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

        try{
            let userGoals = await GoalModel.find(searchParams);
            res.status(200);
            res.json({message : "Successfully retrieved goals", data : userGoals})
        }
        catch(ex){
            res.status(500);
            res.json({error: "Unknown server error"});
        }
    }
};

module.exports = GoalController;