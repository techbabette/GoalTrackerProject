let GoalModel = require("../models/Goal.js");
let ProgressModel = require("../models/Progress.js");
let BaseService =  require("./BaseService.js");

class GoalService extends BaseService{
    static async removeGoal(userId, goalId){
        let serviceResult = await GoalService.attemptExecution(async()=>{
            let returnObject = {};

            let goalToRemove = await GoalModel.findOneAndDelete({userId, _id: goalId});

            if(!goalToRemove){
                returnObject.success = false;
                returnObject.message = "This progress entry does not belong to you"
                return returnObject;
            }

            await ProgressModel.deleteMany({goalId});


            returnObject.success = true;
            returnObject.message = "Successfully removed goal";
            return returnObject;
        })
        return serviceResult; 
    }
}

module.exports = GoalService