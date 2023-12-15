//Add the CSRF Token to the website
function addCsrfToken(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
}

//Export
module.exports = addCsrfToken;
