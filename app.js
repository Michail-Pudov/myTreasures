const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const logger = require("morgan");
const flash = require("connect-flash");
const mongoose = require("mongoose");
var methodOverride = require("method-override");

const indexRouter = require("./routes/index");
const accountRouter = require("./routes/account");

mongoose.pluralize(null);

mongoose.connect("mongodb://localhost/myTreasures", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connections;
db.concat("error", console.error.bind(console, "Error with MongoDB: "));

const app = express();

app.set("views", path.join(__dirname, "public/views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    store: new FileStore(),
    key: "user_sid",
    secret: "anything here",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: 600000,
      httpOnly: false
    }
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use(
  methodOverride(function(req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use(flash());

app.use("/", indexRouter);

app.use(function(req, res, next) {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
});

app.use((req, res, next) => {
  const { user } = req.session;
  if (user) {
    res.locals.user = user;
    next();
  } else {
    delete res.locals.user;
    next();
  }
});

app.use("/account", accountRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
