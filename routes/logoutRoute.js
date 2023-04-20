const { handleLogout } = require("../controllers/logoutController");
const router = require("express").Router();

router.route("/").delete(handleLogout);

module.exports = router;
