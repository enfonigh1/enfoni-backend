const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const router = require("express").Router();
const routes = require("./routes/v1/router");
const session = require("express-session");
const cookieParser = require("cookie-parser")
app.use(express.json());
const keys = require("../keys.json");
require("dotenv").config();

app.set("keys", keys.enfoni);

var corsOptions = {
  origin: 'https://www.enfonigh.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// app.use(cors(corsOptions));
app.use(cors());
const PORT = process.env.PORT || 3001;
require("./database/database")(app.get("keys").db_name);
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cookieParser())
app.use("", routes);

app.listen(PORT, console.log(`APP RUNNING ON ${PORT}`));
