//Packages
const multer = require("multer");
const uuid = require("uuid").v4;

//Multer
const upload = multer({
  storage: multer.diskStorage({
    destination: "../public/images",
    filename: function (req, file, cb) {
      //multer expects two values on this function over here: the first one, is a potential error we might have in case of more complex data. The second parameter is the destination file, which in our case here is 'images'.
      //the three parameters are requested by multer, that is why we need to define a function!
      cb(null, file.originalname); //use our own file name. the first parameter is also null, and the second parameter is the original file name and then add a pseudo unique name. uuid package helps with generating a unique name.
    },
  }),
});

//Middleware
const configuredMulterMiddleware = upload.single("image");

//Export
module.exports = configuredMulterMiddleware;
