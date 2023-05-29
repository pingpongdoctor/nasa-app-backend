const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/usersModel");

//DEFINE A LOGIN CALLBACK FUNCTION
exports.loginAccount = async function (req, res) {
  try {
    const { password, email, googleId } = req.body;

    //IF LOGIN WITH PASSWORD AND EMAIL
    if (password && email && !googleId) {
      //CHECK IF AND PASSWORD ARE MATCHED WITH ANY USER PROFILE
      const foundUser = await User.findOne({ password, email });

      //IF THERE IS A MATCHED USER PROFILE
      if (foundUser) {
        const { _id, username } = foundUser;
        console.log(foundUser);
        res.status(200).json({
          message: "successful authentication",
          user: {
            id: _id,
            username: username,
          },
        });
      } else {
        res.status(400).json({
          message: "failed authentication",
        });
      }
    }

    //IF LOGIN WITH GOOGLE ACCOUNT
    if (!password && email && googleId) {
      //CHECK IF USER IS AVAILABLE
      const foundUser = await User.findOne({ email, googleId });

      //IF USER EXIST
      if (foundUser) {
        res
          .status(200)
          .json({ message: "user already exist", id: foundUser._id });
      }

      //IF USER IS NEW
      if (!foundUser) {
        //CREATE A NEW USER
        const createdUser = await User.create({
          email,
          googleId,
        });
        //RETURN ID OF THE NEW USER
        const { _id } = createdUser;
        res.status(201).json({
          message: "new user is created",
          id: _id,
        });
      }
    }
  } catch (e) {
    console.log(`Login Error ${e}`);
  }
};
