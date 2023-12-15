////Home page route
//Packages
const express = require("express");

//Express
const router = express.Router();

//Route
router.get("/", function (req, res) {
  res.redirect("/perseus/home");
});

//Export
module.exports = router;
