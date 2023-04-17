const router = require("express").Router();
const { loginAccount } = require("../controllers/loginController");

router.route("/").post(loginAccount);

module.exports = router;
