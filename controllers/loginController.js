const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/usersModel");

//DEFINE A LOGIN CALLBACK FUNCTION
exports.loginAccount = async function (req, res) {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).send("Fail Authentication");
    } else {
      //CHECK IF USERNAME AND PASSWORD ARE MATCHED WITH ANY USER PROFILE
      const foundUser = await User.findOne({ username, password });

      //IF THERE IS A MATCHED USER PROFILE
      if (foundUser) {
        //JWT PAYLOAD
        const payloadObj = {
          _id: foundUser._id,
          username: foundUser.username,
        };
        //CREATE ACCESS TOKEN THAT IS EXPIRED IN 15 MINUTES
        const accessToken = jwt.sign(payloadObj, JWT_SECRET, {
          expiresIn: 60 * 15,
        });
        //CREATE REFRESH TOKEN THAT IS EXPIRED IN 1 HOUR
        const refreshToken = jwt.sign(payloadObj, JWT_SECRET, {
          expiresIn: "1h",
        });
        //RESPONSE REFRESH TOKEN IN COOKIE AND ACCESS TOKEN IN THE SEND METHOD
        //THE COOKIE EXPIRY TIME IS 1 HOUR
        res
          .status(200)
          .cookie("refreshToken", refreshToken, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true, //Avoid XSS
            samesite: "lax", //Avoid Cross-site request forgery
            // secure: true, Use this to only allow cookie sent on https (need SSL/TLS certificate)
          })
          .cookie("accessToken", accessToken, {
            maxAge: 60 * 15 * 1000,
            httpOnly: true, //Avoid XSS
            samesite: "lax",
          })
          .send("Access Token and Refresh Token are returned in Cookie ");
      } else {
        res.status(400).send("Fail Authentication");
      }
    }
  } catch (e) {
    console.log(`Login Error ${e}`);
  }
};
