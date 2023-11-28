const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const cors = require("cors");
const routes = require("./routes/index.js");
require("dotenv").config();
require("./db.js");
var path = require('path');
const { logger } = require("./components/logger.js");
const fileupload = require("express-fileupload");
const cookieParser = require('cookie-parser');
require("./auth/google.js");
const server = express();

server.name = "API";

let sessionConfig ={
  secret: process.env.SECRET_KEY,
  name: 'backend-trendy',
  resave: true,
  saveUninitialized: true,
  cookie: {
    sameSite: 'none',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}


if (process.env.NODE_ENV === 'production') {
  server.set('trust proxy', 1); // trust first proxy
  sessionConfig.cookie.secure = true; // serve secure cookies
}

server.use(cookieParser());
server.use(session(sessionConfig));
server.use(passport.initialize());
server.use(passport.session());

server.use(cors());

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
