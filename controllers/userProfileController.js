//DEFINE CALLBACK FUNCTION TO GET USERPROFILE
exports.getUserProfile = async function (req, res) {
  console.log("get user profile");
  try {
    if (req.user) {
      console.log(req.user);
      res.status(200).json(req.user);
    } else {
      res.status(400).send("Need to login to get the user profile");
    }
  } catch (e) {
    console.log(`Get user profile error ${e}`);
  }
};
