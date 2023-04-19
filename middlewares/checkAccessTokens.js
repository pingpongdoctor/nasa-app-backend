const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

//DEFINE THE MIDDILEWARE TO CHECK ACCESS TOKEN AND REFRESH TOKEN
exports.checkAccessToken = async function (req, res, next) {
  if (req.user) {
    next();
    return;
  }

  try {
    const accessToken = req.cookies.accessToken;
    //IF ACCESS TOKEN IS PROVIDED
    if (!accessToken) {
      next();
      return;
    } else {
      //IF ACCESS TOKEN IS PROVIDED
      if (jwt.verify(accessToken, JWT_SECRET)) {
        const userProfile = jwt.decode(accessToken);
        req.user = userProfile;
        next();
        return;
      }
    }
  } catch (e) {
    next();
    return;
  }
};