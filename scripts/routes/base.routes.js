////Main error and images routes
//Packages
const express = require("express");
//Router object
const router = express.Router();

//Models
const Image = require("../models/images.models");
//Graph icon image
async function images() {
  const graph = await Image.findOne("6234acd37f1725f06b582774");
  return graph;
}

//Routes
router.get("/401", function (req, res) {
  const graph = images();
  res.status(401).render("general/shared/401", { graph: graph });
});

router.get("/403", function (req, res) {
  const graph = images();
  res.status(403).render("general/shared/403", { graph: graph });
});

//Export
module.exports = router;
