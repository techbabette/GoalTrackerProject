const express = require("express");
const mongoose =  require("mongoose");
const bodyParser =  require("body-parser");
const cors = require("cors");
const asyncHandler = require("./middleware/asyncHandler");
require('dotenv').config();

const app = express();

let URLParser = bodyParser.urlencoded({extended: false});
let JSONParser = bodyParser.json();

let UserRouter = require("./routes/Users");
let GoalRouter = require("./routes/Goals");
let ProgressRouter = require("./routes/Progress");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(res => console.log(`Connection Succesful ${res}`))
.catch(err => console.log(`Error in DB connection ${err}`));

app.use(cors());

app.use(express.json());
app.use(URLParser);
app.use(JSONParser);

app.use("/users", asyncHandler(UserRouter));
app.use("/goals", asyncHandler(GoalRouter));
app.use("/progress" , asyncHandler(ProgressRouter));

let port = process.env.PORT ?? 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})