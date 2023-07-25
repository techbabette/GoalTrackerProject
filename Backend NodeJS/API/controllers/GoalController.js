let GoalService = require("../services/GoalService.js");
let BaseController =  require("./BaseController.js");

class GoalController extends BaseController  {
    static async createGoal (req, res)  {
        let result = await GoalController.attemptExecution(() => GoalService.createGoal(userId, req.body));

        if(result.success){
            res.status(200);
            res.json({message: result.message, data:result.data});
            return;
        }

        res.status(403);
        res.json({error: result.message})
    }
    static async editGoal (req, res) {
        let userId = GoalController.getUserIdFromToken(req);

        let result = await GoalController.attemptExecution(() => GoalService.editGoal(userId, req.body), res);

        if(result.success){
            res.status(200);
            res.json({message: result.message});
            return;
        }

        res.status(403);
        res.json({error: result.message})
    }
    static async removeGoal (req, res){
        let userId = GoalController.getUserIdFromToken(req);

        let {goalId} = req.body;

        let result = await GoalController.attemptExecution(() => GoalService.removeGoal(userId, goalId), res);

        if(result.success){
            res.status(200);
            res.json({message: result.message});
            return;
        }

        res.status(403);
        res.json({error: result.message})
    }
    static async getUserGoals (req, res) {
        let userId = GoalController.getUserIdFromToken(req);

        let result = await GoalController.attemptExecution(() => GoalService.getUserGoals(userId, req.body), res);

        if(result.success){
            res.status(200);
            res.json({message: result.message, data: result.data});
            return;
        }

        res.status(403);
        res.json({error: result.message})
    }
};

module.exports = GoalController;