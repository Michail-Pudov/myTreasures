const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const dateFormat = require("dateformat");
const moment = require("moment");

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
  // console.log(user);

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
      // await user.save();
    }
  } //////////Почему не изменяются суммы в категориях?
  for (let i = 0; i < user.categoriesArray.length; i++) {
    if (user.categoriesArray[i].categories === to) {
      user.categoriesArray[i].amount += +amount;
      // await user.save();
    }
  }
  user.allAmount -= +amount;
  user.allSpending += +amount;
  await user.save();
  req.session.user = user;
  res.redirect("/account");
});

router.get("/allTransaction", async function(req, res) {
  res.render("allTransaction.hbs");
});

router.get("/logout", async function(req, res, next) {
  req.session.destroy();
  res.clearCookie("user_sid");
  res.redirect("/");
});

module.exports = router;
