const express = require("express");
require('dotenv').config();

const app = express();

let UserRouter = require("./routes/Users");

app.use("/users", UserRouter);

let port = process.env.PORT ?? 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})