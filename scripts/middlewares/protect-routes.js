//Admin functions to show authentication OR authorization errors
function protectRoutes(req, res, next) {
  if (!res.locals.isAuth) {
    return res.redirect("/perseus/401");
  }

  if (req.path.startsWith("/perseus/auth") && !res.locals.isAuth) {
    return res.redirect("/perseus/401");
  }

  if (req.path.startsWith("/perseus/admin") && !res.locals.isAdmin) {
    return res.redirect("/perseus/403");
  }

  next();
}

//Export
module.exports = protectRoutes;
