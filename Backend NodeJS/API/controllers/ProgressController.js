let ProgressModel = require("../models/Progress.js");
let GoalModel = require("../models/Goal.js");
let BaseController =  require("./BaseController.js");

class ProgressController extends BaseController{
    static async addProgress (req, res){
        let {goalId, repeats, date, notes} = req.body;

        let userId = ProgressController.getUserIdFromToken(req);

        let goalBelongsToUser = await ProgressController.attemptExecution(async()=>{
            return await GoalModel.findOne({userId, _id:goalId});
        })

        if(!goalBelongsToUser){
            res.status(400);
            res.json({"error": "This goal does not belong to you"});
            return;
        }

        await ProgressController.attemptExecution(async()=>{
            await ProgressModel.create({goalId, userId, repeats, date, notes});

            let goal = await GoalModel.findById(goalId);

            goal.repeats += parseInt(repeats);

            goal.save();

            res.status(201);
            res.json({"message": "Successfully added progress entry"});
        })
    }
    static async editProgress (req, res){
        let userId = ProgressController.getUserIdFromToken(req);

        let {progressId, notes, repeats, date} = req.body;

        let databaseProgress = await ProgressController.attemptExecution(async()=>{
            return await ProgressModel.findOne({userId, _id : progressId});
        });

        if(!databaseProgress){
            res.status(400);
            res.json({"error": "This progress entry does not belong to you"});
            return;
        }

        let goalProgressIsAttachedTo = await ProgressController.attemptExecution(async()=>{
            return await GoalModel.findById(databaseProgress.goalId);
        })

        if(repeats){
            goalProgressIsAttachedTo.repeats += repeats - databaseProgress.repeats;
            databaseProgress.repeats = repeats;
        }

        if(notes){
            databaseProgress.notes = notes;
        }

        if(date){
            databaseProgress.date = date;
        }

        await ProgressController.attemptExecution(async()=>{
            databaseProgress.save()
            goalProgressIsAttachedTo.save();
            res.status(200);
            res.json({"message": "Successfully edited progress entry"});
        })
    }
    static async getUserProgress (req, res){
        let userId = ProgressController.getUserIdFromToken(req);

        let searchParams = {userId};

        //Returns the user's progress, attemptExecution wraps the function in a try catch block
        ProgressController.attemptExecution(async()=>{
            let userProgress = await ProgressModel.find(searchParams);
            res.status(200);
            res.json({message : "Successfully retrieved progress", data : userProgress})
        })
    }
}

module.exports = ProgressController;