const mongoose =  require("mongoose");
const assert = require("assert");
let UserService = require("../services/UserService.js");
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

function generateRandomUsername(length = 4){
    return (Math.random().toString(36)+'00000000000000000').slice(2, length+2)
}

describe("User registration", () =>{
    let correctUser;

    beforeEach(() => {
        correctUser = {
            "username":generateRandomUsername(),
            "password":"Password3",
            "repeatPassword":"Password3",
            "email": "someonesemail@gmail.com"
        };
    })

    it("Can detect improper passwords", async () => {
        correctUser.password = "failingpassword";
        let result = await UserService.createUser(correctUser);
        assert.ok(result.success === false);
    });

    it("Can detext short username", async () => {
        correctUser.username = "fa";
        let result = await UserService.createUser(correctUser);
        assert.ok(result.success === false);
    })

    it("Can detect email already in use", async () => {
        correctUser.email = process.env.EMAIL_USER;
        let result = await UserService.createUser(correctUser);
        assert.ok(result.success === false);
    })

    it("Can pass tests with correct information", async () => {
        let result = await UserService.createUser(correctUser, true);
        assert.ok(result.success === true);
    })
})
describe("User authentication", () => {
    let correctInformation;

    beforeEach(() => {
        correctInformation = {
            email : process.env.EMAIL_USER,
            password : "Password3"
        }
    })
    it("Can catch non-existing email", async () => {
        correctInformation.email = "incorrectemail@gmail.com";
        let result = await UserService.authenticateUser(correctInformation);
        assert.ok(result.success === false);
    })

    it("Can catch inactive account", async () => {
        correctInformation.email = "inactiveemail@gmail.com";
        let result = await UserService.authenticateUser(correctInformation);
        assert.ok(result.success === false);
    })

    it("Can catch incorrect email password pair", async () => {
        correctInformation.password = "wrongpassWord1";
        let result = await UserService.authenticateUser(correctInformation);
        assert.ok(result.success === false);
    })

    it("Can authenticate user with correct information", async () => {
        let result = await UserService.authenticateUser(correctInformation);
        assert.ok(result.success === true);
    })
})