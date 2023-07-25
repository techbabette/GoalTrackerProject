let GoalModel = require("../models/Goal.js");
let ProgressModel = require("../models/Progress.js");
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
    static async editGoal (req, res) {
        let {goalId, name, unit, repeats, desiredRepeats, startDate, desiredEndDate, dateCompleted, timeConversionRatio} = req.body;

        let userId = GoalController.getUserIdFromToken(req);

        let goalBelongsToUser = await GoalController.attemptExecution(async()=>{
            return await GoalModel.findOne({userId, _id:goalId});
        })

        if(!goalBelongsToUser){
            res.status(400);
            res.json({"error": "This goal does not belong to you"});
            return;
        }

        let databaseGoal = goalBelongsToUser;

        if(name){
            databaseGoal.name = name;
        }

        if(unit){
            databaseGoal.unit = unit;
        }

        if(repeats){
            databaseGoal.repeats = repeats;
        }

        if(desiredRepeats){
            databaseGoal.desiredRepeats = desiredRepeats;
        }

        if(startDate){
            databaseGoal.startDate = startDate;
        }

        if(desiredEndDate){
            databaseGoal.desiredEndDate = desiredEndDate;
        }

        if(dateCompleted){
            databaseGoal.dateCompleted = dateCompleted;
        }

        if(timeConversionRatio){
            databaseGoal.timeConversionRatio = timeConversionRatio;
        }

        await BaseController.attemptExecution(async()=>{
            databaseGoal.save()
            res.status(200);
            res.json({"message": "Successfully edited goal"});
        })
    }
    static async removeGoal (req, res){
        let userId = GoalController.getUserIdFromToken(req);

        let {goalId} = req.body;

        await GoalController.attemptExecution(async()=>{
            let goalToRemove = await GoalModel.findOneAndDelete({userId, _id: goalId});

            if(!goalToRemove){
                res.status(400);
                res.json({"error": "This progress entry does not belong to you"});
                return;
            }

            await ProgressModel.deleteMany({goalId});

            res.status(200);
            res.json({"message" : "Successfully removed goal"});
            return;
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