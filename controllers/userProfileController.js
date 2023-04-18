const User = require("../models/usersModel");

//DEFINE CALLBACK FUNCTION TO GET USERPROFILE
exports.getUserProfile = async function () {
  try {
    if (req.user) {
      const { _id } = req.user;
      const userProfile = await User.findOne({ _id });
      res.status(200).json(userProfile);
    } else {
      res.status(400).send("Need login to get the user profile");
    }
  } catch (e) {
    throw new Error(e);
  }
};