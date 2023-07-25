let GoalModel = require("../models/Goal.js");
let ProgressModel = require("../models/Progress.js");
let BaseService =  require("./BaseService.js");

class GoalService extends BaseService{
    static async createGoal(userId, goalInformation){
        let returnObject = {};

        let {name, unit, repeats, desiredRepeats, startDate, desiredEndDate} = goalInformation;

        //Creates a new goal for the submitting user, attemptExecution wraps the function in a try catch block
        let newGoal = await GoalModel.create({userId, name, unit, repeats, desiredRepeats, desiredEndDate, startDate});

        returnObject.success = true;
        returnObject.message = "Successfully created goal";
        returnObject.data = newGoal;
        return returnObject;
    }
    static async editGoal(userId, goalInformation){
        let returnObject = {};

        let {goalId, name, unit, repeats, desiredRepeats, startDate, desiredEndDate, dateCompleted, timeConversionRatio} = goalInformation

        let goalBelongsToUser = await GoalModel.findOne({userId, _id:goalId});

        if(!goalBelongsToUser){
            returnObject.success = false;
            returnObject.message = "This goal does not belong to you"
            return returnObject;
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

        await databaseGoal.save()
        returnObject.success = true;
        returnObject.message = "Successfully edited goal"
        return returnObject;
    }
    static async removeGoal(userId, goalId){
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
    }
    static async getUserGoals(userId, additionalParameters){
        let returnObject = {};

        let searchParams = {userId};

        if(additionalParameters.onlyCompleted){
            searchParams.dateCompleted = {$exists:true}
        }

        if(additionalParameters.onlyUncompleted){
            searchParams.dateCompleted = {$exists:false};
        }

        let userGoals = await GoalModel.find(searchParams);
        returnObject.success = true;
        returnObject.message = "Successfully retrieved goals";
        returnObject.data = userGoals;

        return returnObject;
    }
}

module.exports = GoalService