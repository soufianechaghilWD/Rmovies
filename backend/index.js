const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require('./controller/userIndex')
const adminRouter = require('./controller/adminIndex')

const app = express();
// connect to database
mongoose.connect("mongodb://localhost:27017/Rmovies");

app.get("/", (req, res) => res.send("Hi there"));

// middlewares
app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(adminRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("app running on http://localhost:" + port));
