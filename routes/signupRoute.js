const router = require("express").Router();
const { signupNewAccount } = require("../controllers/signupController");

//ROUTE TO SIGN UP NEW ACCOUNT
router.route("/").post(signupNewAccount);

module.exports = router;
