const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const { body } = require('express-validator')
app.use(bodyParser.urlencoded( {extended: false } ))
app.use(bodyParser.json())

const cors = require('cors')
require('dotenv').config()
app.use(cors())

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true }, function(err) {
  if (err) return console.log("Error connecting to MongoDB:", err)
  console.log("Connection to MongoDB -- ready state is:", mongoose.connection.readyState)
})

const userHandler = require("./handlers/userHandler.js")

// Routing setup
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", userHandler.addUser);

app.get("/api/users", userHandler.getAllUsers);

app.post("/api/users/:_id/exercises", userHandler.addExercise);

app.get("/api/users/:_id/logs", userHandler.getAllExercises);

app.use(function(req, res, next) {
  res.sendFile(__dirname + "/views/404.html")
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
