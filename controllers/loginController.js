const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/usersModel");

//DEFINE A LOGIN CALLBACK FUNCTION
exports.loginAccount = async function (req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).send("Fail Authentication");
    } else {
      //GET ALL USERS
      const users = await User.find({});
      //CHECK IF USERNAME AND PASSWORD ARE MATCHED WITH ANY USER PROFILE
      const foundUser = users.find(
        (user) => user.username === username && user.password === password
      );

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
        res
          .status(200)
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            samesite: "strict",
          })
          .send(accessToken);
      } else {
        res.status(400).send("Fail Authentication");
      }
    }
  } catch (e) {
    throw new Error(e);
  }
};
