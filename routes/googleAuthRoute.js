const router = require("express").Router();
const CLIENT_URL = process.env.CLIENT_URL;
const passport = require("passport");

//ROUTE TO IMPLEMENT GOOGLE AUTHENTICATION
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

//ROUTE TO NAVIGATE TO SITES WHEN THE AUTHENTICATION IS FAILED OR SUCCESSFUL
router.route("/google/callback").get(
  passport.authenticate("google", {
    // FAILED AUTHENTICATION, REDIRECT TO THE CLIENT LOGIN PAGE
    failureRedirect: `${CLIENT_URL}/login`,
  }),

  (_req, res) => {
    // SUCCESSFUL AUTHENTICATION, REDIRECT TO CLIENT HOMEPAGE
    res.redirect(CLIENT_URL);
  }
);

module.exports = router;
