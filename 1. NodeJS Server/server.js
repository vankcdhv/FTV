const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const keepSession = require('./src/api/common/keep_session');
const messageNotify = require('./src/api/common/messageNotify');
const db = require('./src/api/database/dbcontext-fix');
const keepHeroku = require('./src/api/common/heroku');
const {
  sleep
} = require("./src/api/fap/logic");

(async () => {
  dotenv.config({
    path: "./config/.env"
  });

  const port = process.env.PORT || 3000;

  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  app.use(express.static("public"));
  app.set("view engine", "ejs");
  app.set("views", "./src/views");

  let routes = require("./src/api/common/routes"); //importing route
  routes(app);


  app.use(function (req, res) {
    res.status(404).send({
      url: req.originalUrl + " not found"
    });
  });

  app.listen(port);
  console.log("RESTful API server started on: " + port);
  console.log('Start...');
  keepSession.keepSession();
  messageNotify.notify();
})();