let ResponseObject = require("./ServiceResponseObject");

class baseService{
    //Available in case all services require certain functionality in the future
    static async runTests (testArray, testSubject, responseObject){
        for(let singleTest of testArray){
            let result = await(singleTest.test(testSubject));
            if(!result){
                responseObject.message = singleTest.message;
                responseObject.errors.usernameError = singleTest.message;
                responseObject.success = false;
                return responseObject;
            }
        }
        return responseObject;
    }
}

module.exports = baseService