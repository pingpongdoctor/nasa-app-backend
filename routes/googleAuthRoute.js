const router = require("express").Router();
const CLIENT_URL = process.env.CLIENT_URL;
const passport = require("passport");

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.route("/google/callback").get(
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/login`,
  }),
  (_req, res) => {
    // Successful authentication, redirect to client-side application
    res.redirect(CLIENT_URL);
  }
);

module.exports = router;
