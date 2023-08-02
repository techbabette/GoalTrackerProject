let ProgressService = require("../services/ProgressService.js");
let BaseController =  require("./BaseController.js");

class ProgressController extends BaseController{
    static async addProgress (req, res){
        let userId = ProgressController.getUserIdFromToken(req);

        let result = await ProgressController.attemptExecution(() => ProgressService.addProgress(userId, req.body));

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
    static async editProgress (req, res){
        let userId = ProgressController.getUserIdFromToken(req);

        let result = await ProgressController.attemptExecution(() => ProgressService.editProgress(userId, req.body));

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
    static async removeProgress (req, res){
        let userId = ProgressController.getUserIdFromToken(req);

        let result = await ProgressController.attemptExecution(() => ProgressService.removeProgress(userId, req.body));

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
    static async getUserProgress (req, res){
        let userId = ProgressController.getUserIdFromToken(req);

        let result = await ProgressController.attemptExecution(() => ProgressService.getUserProgress(userId));

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
}

module.exports = ProgressController;