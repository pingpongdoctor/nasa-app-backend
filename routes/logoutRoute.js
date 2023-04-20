const { handleLogout } = require("../controllers/logoutController");
const router = require("express").Router();

//ROUTE TO LOGOUT
router.route("/").delete(handleLogout);

module.exports = router;
