const router = require("express").Router();
const {
  getNewAccessTokenFromRefreshToken,
} = require("../controllers/getAccessTokenController");

router.route("/").get(getNewAccessTokenFromRefreshToken);

module.exports = router;
