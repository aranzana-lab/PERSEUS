//Packages Required
const path = require("path");
const express = require("express");
// const csrf = require("csurf");
const expressSession = require("express-session");

//DB, Config & Middlewares
const createSessionConfig = require("./config/session");
const db = require("./data/database");
// const addCsrfTokenMiddleware = require("./middlewares/csrf-token-middleware");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
// const checkAuthStatusMiddleware = require("./middlewares/auth-middleware"); //If the sign-uo function wahts to be recovered, uncomment this line

//Routes
// const authRoutes = require("./routes/auth.routes");
const pedigreeRoutes = require("./routes/pedigree.routes");
const perseusRoutes = require("./routes/perseus.routes");
const imagesUserRoutes = require("./routes/images.routes");
const baseRoutes = require("./routes/base.routes");
const apiRoutes = require("./routes/api.routes");

// const perseusRoutesAuth = require("./routes/perseus.auth.routes"); //If the sign-uo function wahts to be recovered, uncomment this line

//Execute express
const app = express();

//EJS package
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Use a middleware to connect to the public folder as static file.
app.use("/perseus", express.static("../public"));

//Call middleware for the user database
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Session config
//Call express-session package as function
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

//CSRF Middleware
//app.use(csrf());
//app.use(addCsrfTokenMiddleware);

//Use of Middleware Auth Status
// app.use(checkAuthStatusMiddleware); //If the sign-uo function wahts to be recovered, uncomment this line

//Static express for the images
app.use("/images", express.static("/public/images"));

//Use routes
app.use("/perseus", perseusRoutes);
app.use("/perseus", pedigreeRoutes);
// app.use("/perseus",authRoutes); //If the sign-up function wahts to be recovered, uncomment this line
app.use("/perseus", baseRoutes);
app.use("/perseus", apiRoutes);
app.use(protectRoutesMiddleware);
app.use("/perseus/admin", imagesUserRoutes);
app.use(protectRoutesMiddleware);
// app.use("/perseus/auth", perseusRoutesAuth); //If the sign-uo function wahts to be recovered, uncomment this line

app.use(errorHandlerMiddleware);

//Connect to the DB
db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });
