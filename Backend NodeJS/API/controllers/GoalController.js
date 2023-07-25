let GoalService = require("../services/GoalService.js");
let BaseController =  require("./BaseController.js");

class GoalController extends BaseController  {
    static async createGoal (req, res)  {
        let userId = GoalController.getUserIdFromToken(req);

        let result = await GoalController.attemptExecution(() => GoalService.createGoal(userId, req.body), res);

        if(result.serverError){
            res.status(500)
            res.json(result);
            return;
        }

        if(!result.success){
            res.status(403);
            res.json(result)
            return;
        }

        res.status(200);
        res.json(result);
    }
    static async editGoal (req, res) {
        let userId = GoalController.getUserIdFromToken(req);

        let result = await GoalController.attemptExecution(() => GoalService.editGoal(userId, req.body), res);

        if(result.serverError){
            res.status(500)
            res.json(result);
            return;
        }

        if(!result.success){
            res.status(403);
            res.json(result)
            return;
        }

        res.status(200);
        res.json(result);
        return;
    }
    static async removeGoal (req, res){
        let userId = GoalController.getUserIdFromToken(req);

        let {goalId} = req.body;

        let result = await GoalController.attemptExecution(() => GoalService.removeGoal(userId, goalId), res);

        if(result.serverError){
            res.status(500)
            res.json(result);
            return;
        }

        if(!result.success){
            res.status(403);
            res.json(result);
            return;
        }

        res.status(200);
        res.json(result);
        return;
    }
    static async getUserGoals (req, res) {
        let userId = GoalController.getUserIdFromToken(req);

        let result = await GoalController.attemptExecution(() => GoalService.getUserGoals(userId, req.body), res);

        if(result.serverError){
            res.status(500)
            res.json(result);
            return;
        }

        if(!result.success){
            res.status(403);
            res.json(result)
            return;
        }

        res.status(200);
        res.json(result);
        return;
    }
};

module.exports = GoalController;