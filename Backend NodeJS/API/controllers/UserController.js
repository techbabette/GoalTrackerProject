let UserModel = require("..models/User.js");

module.exports = {
    getGreeting: (req, res) => {
        res.send("Hello user");
    }
}