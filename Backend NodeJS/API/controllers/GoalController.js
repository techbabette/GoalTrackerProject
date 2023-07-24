let GoalModel = require("../models/Goal.js");

function getUserIdFromToken(req){
    let tokenSent = req.headers["bearer"];


    let userId = JSON.parse(Buffer.from(tokenSent.split('.')[1], 'base64').toString()).user_id; 

    return userId;
}

module.exports = {
    createGoal : async (req, res) => {
        let {name, unit, repeats, desiredRepeats, startDate, desiredEndDate} = req.body;

        let userId = getUserIdFromToken(req);

        try{
            let newGoal = await GoalModel.create({userId, name, unit, repeats, desiredRepeats, desiredEndDate, startDate});
            res.json(newGoal);
        }
        catch(ex){
            res.status(500);
            console.log(ex);
            res.json({error: "Unknown server error"});
        }
    },
    getUserGoals : async(req, res) => {
        let userId = getUserIdFromToken(req);

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