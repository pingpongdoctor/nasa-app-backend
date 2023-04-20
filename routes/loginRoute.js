const router = require("express").Router();
const { loginAccount } = require("../controllers/loginController");

//ROUTE TO LOG IN
router.route("/").post(loginAccount);

module.exports = router;
