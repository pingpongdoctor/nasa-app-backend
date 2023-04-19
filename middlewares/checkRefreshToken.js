const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

//DEFINE THE MIDDLEWARE TO CHECK THE REFRESH TOKEN
exports.checkRefreshToken = async function (req, res, next) {
  if (req.user) {
    next();
    return;
  }

  try {
    const refreshToken = req.cookies.refreshToken;

    //IF REFRESH TOKEN IS NOT PROVIDED
    if (!refreshToken) {
      res.status(400).send("Refresh Token is not provided");
      return;
    } else {
      //IF REFRESH TOKEN IS PROVIDED
      if (refreshToken && jwt.verify(refreshToken, JWT_SECRET)) {
        //CHECK IF THE USER PROFILE IS STILL AVAILABLE IN DATABASE
        const userObj = jwt.decode(refreshToken);
        const foundUser = await User.findOne({
          _id: userObj._id,
          username: userObj.username,
        });

        //IF USER OF THIS REFRESH TOKEN IS STILL AVAILABLE IN DATABASE
        if (foundUser) {
          const newAccessToken = jwt.sign(
            {
              _id: foundUser._id,
              username: foundUser.username,
            },
            JWT_SECRET,
            {
              expiresIn: 60 * 15,
            }
          );

          res
            .status(200)
            .cookie("accessToken", newAccessToken, {
              maxAge: 60 * 15 * 1000,
              httpOnly: true, //Avoid XSS
              samesite: "lax",
            })
            .send("New access token is created");
          return;
        } else {
          //IF USER IS NOT AVAILABLE IN THE DATABASE
          res.clearCookie("refreshToken");
          res.clearCookie("accessToken");
          res.status(500).send("User is not available in the database");
          return;
        }
      } else {
        res.status(400).send("Fail Authentication");
        return;
      }
    }
  } catch (e) {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.status(500).send("Please login to access the database");
  }
};
