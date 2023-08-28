const mongoose =  require("mongoose");
let UserService = require("../services/UserService.js");
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

function generateRandomUsername(length = 4){
    return (Math.random().toString(36)+'00000000000000000').slice(2, length+2)
}

describe("User registration service", () =>{

    let correctUser;

    beforeEach(() => {
        correctUser = {
            "username":generateRandomUsername(),
            "password":"Password3",
            "repeatPassword":"Password3",
            "email": "someonesemail@gmail.com"
        };
    })

    it("Can detect improper passwords", () => {
        correctUser.password = "failingpassword";
        expect(UserService.createUser(correctUser)).resolves.toHaveProperty("success",   true);
    });

    it("Can detext short username", () => {
        correctUser.username = "fa";
        expect(UserService.createUser(correctUser)).resolves.toHaveProperty("success", false);
    })
})