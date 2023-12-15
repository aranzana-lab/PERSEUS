//Remember this info is only useful for admins, and the website path is always /admin/ and then the rest (as we added on app.js).

//Packages
const express = require("express");
//Midleware
const imageUploadMiddleware = require("../middlewares/image-upload-middleware");
//Controller
const imageControllers = require("../controllers/img.controllers");
//Router
const router = express.Router();

//Routes
router.get("/images", imageControllers.getStoredImages);
router.get("/new-image", imageControllers.getNewImages);
router.post("/images", imageUploadMiddleware, imageControllers.StoredImages);

//Export
module.exports = router;
