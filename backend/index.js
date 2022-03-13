const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require('./controller/userIndex')

const app = express();
mongoose.connect("mongodb://localhost:27017/Rmovies");

app.get("/", (req, res) => res.send("Hi there"));

app.use(express.json())
app.use(cors())
app.use(userRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("app running on http://localhost:" + port));
