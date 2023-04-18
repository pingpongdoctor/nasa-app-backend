const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

//DEFINE THE MIDDILEWARE TO CHECK ACCESS TOKEN AND REFRESH TOKEN
exports.checkTokens = function (req, res) {
  const accessToken = req.body?.headers?.authorization?.split(" ")[1];

  if (accessToken && jwt.verify(accessToken, JWT_SECRET)) {
    //IF ACCESS TOKEN IS PROVIDED AND IT IS VALID
    const userProfile = jwt.decode(accessToken);
    req.user = userProfile;
    next();
  } else {
    //IF ACCESS TOKEN IS NOT PROVIDED OR IT IS NOT VALID
    const refreshToken = req.cookies;

    if (refreshToken && jwt.verify(refreshToken, JWT_SECRET)) {
      //IF REFRESH TOKEN IS PROVIDED AND IT IS VALID
      const userProfile = jwt.decode(refreshToken);
      console.log(userProfile);
      const newAccessToken = jwt.sign(
        {
          _id: userProfile._id,
          username: userProfile.username,
        },
        JWT_SECRET,
        {
          expiresIn: 60 * 15,
        }
      );
      //SEND NEW ACCESS TOKEN TO THE CLIENT
      res.status(200).send(newAccessToken);
      next();
    } else {
      res.status(400).send("Fail Authentication");
    }
  }
};
