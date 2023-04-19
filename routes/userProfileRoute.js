const router = require("express").Router();
const { getUserProfile } = require("../controllers/userProfileController");
const { checkAccessToken } = require("../middlewares/checkAccessTokens");
const { checkRefreshToken } = require("../middlewares/checkRefreshToken");

router.route("/").get(checkAccessToken, checkRefreshToken, getUserProfile);

module.exports = router;
