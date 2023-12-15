//Error functions
function handleErrors(error, req, res, next) {
  console.log(error);

  if (errorcode === 404) {
    return res.status(404).render("../views/general/shared/404");
  }

  res.status(500).render("../views/general/shared/500");
}

//Export
module.exports = handleErrors;
