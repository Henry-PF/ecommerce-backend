require("dotenv").config();
const express = require("express");
const session = require('express-session');
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("./auth/google.js");
const cors = require("cors");
const routes = require("./routes/index.js");
var path = require('path');
const { logger } = require("./components/logger.js");
const fileupload = require("express-fileupload");
require("./db.js");

const server = express();

server.name = "API";


server.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

server.use(passport.initialize());
server.use(passport.session());

server.use(cors());
server.use(cookieParser());

server.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  })
);

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(morgan("dev"));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.use(express.static(path.join(__dirname, 'public')))

server.use((req, res, next) => {
  logger.info(`Received a ${req.method} request for ${req.url}`);
  next();
});
server.use("/api/", routes);

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
