const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const checkRefreshToken = function (refreshToken) {
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

      res.status(200).cookie("accessToken", newAccessToken, {
        maxAge: 60 * 15 * 1000,
        httpOnly: true, //Avoid XSS
      });
    }
  } catch (e) {
    //IF REFRESH TOKEN IS INVALID
    res.status(500).send("Fail Authentication");
  }
};

//DEFINE THE MIDDILEWARE TO CHECK ACCESS TOKEN AND REFRESH TOKEN
exports.checkTokens = function (req, res, next) {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  //IF ACCESS TOKEN AND REFRESH TOKEN ARE NOT PROVIDED
  if (!accessToken && !refreshToken) {
    res.status(400).send("No tokens are provided");
    return;
  }

  try {
    //IF ACCESS TOKEN IS PROVIDED
    if (accessToken) {
      if (jwt.verify(accessToken, JWT_SECRET)) {
        const userProfile = jwt.decode(accessToken);
        req.user = userProfile;
        next();
      }
    } else {
      //IF ACCESS TOKEN IS NOT PROVIDED
      checkRefreshToken(refreshToken);
      return;
    }
  } catch (e) {
    //IF ACCESS TOKEN IS NOT VALID
    checkRefreshToken(refreshToken);
  }
};
