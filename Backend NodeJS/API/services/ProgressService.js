let GoalModel = require("../models/Goal.js");
let ProgressModel = require("../models/Progress.js");
let BaseService =  require("./BaseService.js");

class ProgressService extends BaseService{
    static async addProgress(userId, progressInformation){
        let responseObject = {};

        let {goalId, repeats, date, notes} = progressInformation;

        let goalBelongsToUser = await GoalModel.findOne({userId, _id:goalId});

        if(!goalBelongsToUser){
            responseObject.success = false;
            responseObject.message = "This goal does not belong to you";
            return responseObject;
        }

        let newProgressEntry = await ProgressModel.create({goalId, userId, repeats, date, notes});

        //Triggers would be preferable to this
        let goal = await GoalModel.findById(goalId);
        goal.repeats += parseInt(repeats);
        await goal.save();

        responseObject.success = true;
        responseObject.message = "Successfully added progress entry";
        responseObject.data = newProgressEntry;

        return responseObject
    }
    static async editProgress (userId, progressInformation){
        let responseObject = {};

        let {progressId, notes, repeats, date} = progressInformation;

        let databaseProgress = await ProgressModel.findOne({userId, _id : progressId});

        if(!databaseProgress){
            responseObject.success = false;
            responseObject.message = "This progress entry does not belong to you";
            return responseObject;
        }

        let goalProgressIsAttachedTo = await GoalModel.findById(databaseProgress.goalId);

        if(repeats){
            //Triggers would be preferable to this
            goalProgressIsAttachedTo.repeats += repeats - databaseProgress.repeats;
            databaseProgress.repeats = repeats;
        }

        if(notes){
            databaseProgress.notes = notes;
        }

        if(date){
            databaseProgress.date = date;
        }

        await databaseProgress.save()
        await goalProgressIsAttachedTo.save();

        responseObject.success = true;
        responseObject.message = "Successfully edited progress entry";

        return responseObject;
    }
    static async removeProgress (userId, progressInformation){
        let responseObject = {};

        let {progressId} = progressInformation;

        let deletedProgress = await ProgressModel.findOneAndDelete({userId, _id:progressId})

        if(!deletedProgress){
            responseObject.success = false;
            responseObject.message = "This progress entry does not belong to you";
            return responseObject;
        }

        let goalProgressIsAttachedTo = await GoalModel.findById(deletedProgress.goalId);

        goalProgressIsAttachedTo.repeats -= deletedProgress.repeats;

        await goalProgressIsAttachedTo.save();

        responseObject.success = true;
        responseObject.message = "Successfully deleted progress entry"

        return responseObject;
}
    static async getUserProgress (userId, additionalParameters = {}){
        let responseObject = {};

        let searchParams = {userId};

        let userProgress = await ProgressModel.find(searchParams);

        responseObject.success = true;
        responseObject.message = "Successfully retrieved progress entries";
        responseObject.data = userProgress;

        return responseObject;
    }
}

module.exports = ProgressService;