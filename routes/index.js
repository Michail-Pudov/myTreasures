const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/", function(req, res, next) {
  res.render("index.hbs");
});

router.get("/registration", async function(req, res) {
  res.render("registration.hbs");
});

router.post("/registration", async function(req, res) {
  let login = req.body.login;
  let email = req.body.email;
  let password = req.body.password;
  let user = await User.findOne({ email: email });

  if (!user) {
    User.create({
      login: login,
      email: email,
      password: await bcrypt.hash(password, 10),
      allAmount: 0,
      allSpending: 0
    });
    res.redirect("/login");
  } else {
    if (login === user.login) {
      let err = "Извините, но пользователь с таким именем уже существует";
      res.render("registration", { loginMessage: err });
    } else {
      let err = "Извините, но пользователь с таким email уже существует";
      res.render("registration", { emailMessage: err });
    }
  }
});

router.get("/login", function(req, res, next) {
  res.render("login.hbs");
});

router.post("/login", async function(req, res) {
  let login = req.body.login;
  let email = req.body.email;
  let password = req.body.password;
  let user = await User.findOne({ login: login, email: email });

  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.user = user;
    res.redirect("/account");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
