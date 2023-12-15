//Api routes for the axios controllers to search the DB on Neo4j
//Package
const express = require("express");
//Controllers
const apiControllers = require("../controllers/api.controllers");
//Router
const router = express.Router();

//Routes
router.post("/api/specific", apiControllers.postSpecific);
router.post("/api/general", apiControllers.postGeneral);

//Export
module.exports = router;
