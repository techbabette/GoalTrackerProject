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

            goal.repeats += repeats;

            goal.save();

            res.status(201);
            res.json({"message": "Successfully added progress"});
        })
    }
}

module.exports = ProgressController;