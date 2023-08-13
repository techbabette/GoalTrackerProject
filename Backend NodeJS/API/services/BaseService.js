let ResponseObject = require("./ServiceResponseObject");

class baseService{
    //Available in case all services require certain functionality in the future
    static createResponseObject(){
        return new ResponseObject();
    }
    static async runTests (testArray, testSubject, responseObject, errorName = ""){
        for(let singleTest of testArray){
            let result = await(singleTest.test(testSubject));
            if(!result){
                responseObject.message = singleTest.message;

                if(errorName);
                responseObject.errors[errorName] = singleTest.message;
                
                responseObject.success = false;
                return responseObject;
            }
        }
        return responseObject;
    }
}

module.exports = baseService