const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const router = require("express").Router();
const routes = require("./routes/v1/router");
const session = require("express-session");
app.use(express.json());
const keys = require("../keys.json");
require("dotenv").config();

app.set("keys", keys.enfoni);

const PORT = process.env.PORT || 3001;
require("./database/database")(app.get("keys").db_name);
app.use(cors());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use("", routes);

app.listen(PORT, console.log(`APP RUNNING ON ${PORT}`));