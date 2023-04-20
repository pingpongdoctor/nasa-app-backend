const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

//DEFINE THE MIDDLEWARE TO CHECK THE REFRESH TOKEN
exports.checkRefreshToken = async function (req, res, next) {
  //CHECK IF THE USER IS AUTHENTICATED
  if (req.user) {
    next();
    return;
  }

  try {
    const refreshToken = req.cookies.refreshToken;

    //IF REFRESH TOKEN IS NOT PROVIDED
    if (!refreshToken) {
      res.status(401).send("Refresh Token is not provided");
      return;
    } else {
      //IF REFRESH TOKEN IS PROVIDED
      if (refreshToken && jwt.verify(refreshToken, JWT_SECRET)) {
        //IF REFRESH TOKEN IS VALID
        const userObj = jwt.decode(refreshToken);
        const foundUser = await User.findOne({
          _id: userObj._id,
          username: userObj.username,
        });

        // IF THE USER OF THIS REFRESH TOKEN IS STILL AVAILABLE IN DATABASE
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
              sameSite: "none",
              secure: true,
            })
            .send("New access token is created");
          return;
        } else {
          //IF USER IS NOT AVAILABLE IN THE DATABASE
          res
            .clearCookie("refreshToken")
            .clearCookie("accessToken")
            .status(500)
            .send("User is not available in the database");
          return;
        }
      } else {
        //IF THE REFRESH TOKEN IS NOT VALID
        res.status(400).send("Fail Authentication");
        return;
      }
    }
  } catch (e) {
    console.log(`Refresh token Error ${e}`);
    res
      .clearCookie("refreshToken")
      .clearCookie("accessToken")
      .status(500)
      .send("Please log in again");
    return;
  }
};
