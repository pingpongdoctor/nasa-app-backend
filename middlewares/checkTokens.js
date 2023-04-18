const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const {
  getNewAccessTokenFromRefreshToken,
} = require("../controllers/getAccessTokenController");

//DEFINE THE MIDDILEWARE TO CHECK ACCESS TOKEN AND REFRESH TOKEN
exports.checkTokens = function (req, res, next) {
  const accessToken = req.headers?.authorization?.split(" ")[1];
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
      getNewAccessTokenFromRefreshToken();
      return;
    }
  } catch (e) {
    //IF ACCESS TOKEN IS NOT VALID
    getNewAccessTokenFromRefreshToken();
  }
};
