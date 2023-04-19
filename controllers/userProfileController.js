const User = require("../models/usersModel");

//DEFINE CALLBACK FUNCTION TO GET USERPROFILE
exports.getUserProfile = async function (req, res) {
  try {
    if (req.user) {
      const { _id } = req.user;
      const userProfile = await User.findOne({ _id });
      res
        .status(200)
        .json({ _id: userProfile._id, username: userProfile.username });
    } else {
      res.status(400).send("Need login to get the user profile");
    }
  } catch (e) {
    res.status(500).send("Server Error");
  }
};
