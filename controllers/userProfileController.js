//DEFINE CALLBACK FUNCTION TO GET USER PROFILE
exports.getUserProfile = async function (req, res) {
  try {
    if (req.user) {
      res.status(200).json(req.user);
    } else {
      res.status(400).send("Need to log in to get the user profile");
    }
  } catch (e) {
    console.log(`Get user profile error ${e}`);
  }
};
