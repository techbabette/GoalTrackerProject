const express = require("express");
const mongoose =  require("mongoose");
const bodyParser =  require("body-parser");
require('dotenv').config();

const app = express();

let URLParser = bodyParser.urlencoded({extended: false});
let JSONParser = bodyParser.json();

let UserRouter = require("./routes/Users");
let GoalRouter = require("./routes/Goals");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(res => console.log(`Connection Succesful ${res}`))
.catch(err => console.log(`Error in DB connection ${err}`));

app.use(express.json());
app.use(URLParser);
app.use(JSONParser);

app.use("/users", UserRouter);
app.use("/goals", GoalRouter);

let port = process.env.PORT ?? 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})