const { request, response } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8000;
const userRouter = require("./app/routers/userRouter")
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


mongoose.connect("mongodb://localhost:27017/Test_2_AIKING", (error) => {
    if (error) throw (error)
    console.log("Successfulity connect to MongoDB")
})

app.use((request, response, netx) => {
    console.log("Time:", new Date());
    console.log("Request method:", request.method);

    netx()
})

app.use("/", userRouter)

app.get("/", (require, response) => {
    console.log(__dirname);

    response.sendFile(path.join(__dirname + "/views/index.html"))
})
app.use(express.static(__dirname + "/views"));

app.listen(port, () => {
    console.log("App lisstening on port " + port)
})
