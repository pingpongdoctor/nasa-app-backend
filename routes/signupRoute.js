const router = require("express").Router();
const { signupNewAccount } = require("../controllers/signupController");

router.route("/").post(signupNewAccount);

module.exports = router;
