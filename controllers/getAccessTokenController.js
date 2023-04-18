const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.getNewAccessTokenFromRefreshToken = function (req, res) {
  const refreshToken = req.cookies.refreshToken;
  //IF REFRESH TOKEN IS NOT PROVIDED
  if (!refreshToken) {
    res.status(400).send("Refresh Token is not provided");
    return;
  }

  try {
    //IF REFRESH TOKEN IS VALID
    if (refreshToken && jwt.verify(refreshToken, JWT_SECRET)) {
      const userProfile = jwt.decode(refreshToken);
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
      res.status(200).send(newAccessToken);
    }
  } catch (e) {
    //IF REFRESH TOKEN IS INVALID
    res.status(400).send("Fail Authentication");
  }
};
