////Perseus routes
//Package
const express = require("express");
//Controllers
const perseusControllers = require("../controllers/perseus.controllers");
//Router
const router = express.Router();

//Routes
router.get("/home", perseusControllers.getPerseus);
router.get("/contact", perseusControllers.getContact);
router.get("/group", perseusControllers.getAboutUs);
router.get("/project", perseusControllers.getProject);
// router.get("/discover", perseusControllers.getDiscover); //Remember, if recovering the sign-up option, return this router to "perseus.auth.routes"
router.post("/discover", perseusControllers.Discover); //Remember, if recovering the sign-up option, return this router to "perseus.auth.routes"
router.get("/species", perseusControllers.getSpecies); //To obtain the searched species
router.post("/discover-species", perseusControllers.Species); //To obtain the searched species

//Export
module.exports = router;
