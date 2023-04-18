const router = require("express").Router();
const { getUserProfile } = require("../controllers/userProfileController");
const { checkTokens } = require("../middlewares/checkTokens");

router.route("/").get(checkTokens, getUserProfile);

module.exports = router;
