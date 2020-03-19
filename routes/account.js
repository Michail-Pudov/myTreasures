const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const dateFormat = require("dateformat");
const moment = require("moment");
const axios = require("axios");
const fetch = require("cross-fetch");

router.get("/", async function(req, res) {
  res.render("account.hbs");
});

router.get("/newCategory", async function(req, res) {
  res.render("newCategory.hbs");
});

router.get("/newTransaction", async function(req, res) {
  res.render("newTransaction.hbs");
});

router.get("/allTransaction", async function(req, res) {
  res.render("allTransaction.hbs");
});

router.get("/exchange", async function(req, res) {
  let response = await axios({
    method: "GET",
    url: "https://currency-converter5.p.rapidapi.com/currency/list",
    headers: {
      "content-type": "application/octet-stream",
      "x-rapidapi-host": "currency-converter5.p.rapidapi.com",
      "x-rapidapi-key": "4d5121439emsha575bafcee12f1fp1a62bdjsn866b41528bbe"
    },
    params: {
      format: "json"
    }
  });
  let currenciesArray = Object.keys(response.data.currencies);
  res.render("exchange.hbs", { currencies: currenciesArray });
});

router.post("/exchange", async function(req, res) {
  let { from, to, sum } = req.body;

  let response = await axios({
    method: "GET",
    url: "https://currency-converter5.p.rapidapi.com/currency/convert",
    headers: {
      "content-type": "application/octet-stream",
      "x-rapidapi-host": "currency-converter5.p.rapidapi.com",
      "x-rapidapi-key": "4d5121439emsha575bafcee12f1fp1a62bdjsn866b41528bbe"
    },
    params: {
      format: "json",
      from: from,
      to: to,
      amount: sum
    }
  });
  res.json(response.data.rates[to].rate);
});

router.post("/newScore", async function(req, res) {
  let user = await User.findOne({ email: req.session.user.email });
  let { nameScore, amount } = req.body;
  let leng = user.scoreArray.length + 1;
  user.scoreArray.push({
    score: nameScore,
    amount: +amount,
    index: leng
  });
  user.allAmount += +amount;
  await user.save();
  req.session.user = user;
  res.redirect("/account");
});

router.post("/newCategories", async function(req, res) {
  let user = await User.findOne({ email: req.session.user.email });
  let { nameCategories, amount } = req.body;
  let leng = user.categoriesArray.length + 1;
  user.categoriesArray.push({
    categories: nameCategories,
    amount: +amount,
    index: leng
  });
  user.allSpending += +amount;
  await user.save();
  req.session.user = user;
  res.redirect("/account");
});

router.post("/newSpending", async function(req, res) {
  const { from, to, amount, comment, date } = req.body;
  let dateSpending = dateFormat(date, "dd mm yyyy");
  let user = await User.findOne({ email: req.session.user.email });

  user.spendingArray.push({
    from: from,
    to: to,
    amount: +amount,
    comment: comment,
    date: dateSpending
  });

  user.spendingArray.sort(
    (a, b) => moment(b.date, "DD.MM.YY") - moment(a.date, "DD.MM.YY")
  );
  for (let i = 0; i < user.scoreArray.length; i++) {
    if (user.scoreArray[i].score === from) {
      user.scoreArray[i].amount -= +amount;
    }
  }
  for (let i = 0; i < user.categoriesArray.length; i++) {
    if (user.categoriesArray[i].categories === to) {
      user.categoriesArray[i].amount += +amount;
    }
  }
  user.allAmount -= +amount;
  user.allSpending += +amount;
  user.markModified("scoreArray");
  user.markModified("categoriesArray");
  await user.save();
  req.session.user = user;
  req.session.save(() => res.redirect("/account"));
});

router.get("/allTransaction", async function(req, res) {
  res.render("allTransaction.hbs");
});

router.post("/readQR", async function(req, res) {
  let str = req.body.qrString;
  const newString = str
    .replace("i=", "fd=")
    .replace(/t=(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/, "$3.$2.$1+$4%3A$5&qr=0");
  let response = await fetch("https://proverkacheka.com/check/get", {
    credentials: "omit",
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-fetch-dest": "empty",
      "x-requested-with": "XMLHttpRequest"
    },
    referrer: "https://proverkacheka.com/",
    referrerPolicy: "no-referrer-when-downgrade",
    body: newString,
    method: "POST",
    mode: "cors"
  });
  let result = await response.json();
  console.log(result);

  let shoppingList = result.data.json.items.reduce(
    (acc, value) => acc + value.name + " ",
    ""
  );
  let totalSum = result.data.json.totalSum / 100;
  res.render("newTransaction.hbs", {
    shoppingList: shoppingList,
    totalSum: totalSum
  });
});

router.get("/logout", async function(req, res, next) {
  req.session.destroy();
  res.clearCookie("user_sid");
  res.redirect("/");
});

module.exports = router;
