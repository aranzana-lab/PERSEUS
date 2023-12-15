////Models to obtain the stored images on the DB of MongoDB.
//Models
const Image = require("../models/images.models");

//GET Route - Stored Images
async function getStoredImages(req, res, next) {
  try {
    const images = await Image.findAll();
    res.render("../views/admin/imagesuploaded", { images: images });
  } catch (error) {
    next(error);
    return;
  }
}

//POST Route - Stored Images
async function StoredImages(req, res, next) {
  const image = new Image({
    ...req.body,
    image: req.file.filename,
  });
  try {
    await image.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/perseus/admin/images");
}

//GET Route - New Images
function getNewImages(req, res) {
  res.render("../views/admin/new-image");
}

//Export
module.exports = {
  getStoredImages: getStoredImages,
  getNewImages: getNewImages,
  StoredImages: StoredImages,
};
