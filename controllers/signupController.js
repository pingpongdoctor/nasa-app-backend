const User = require("../models/usersModel");

//CALLBACK FUNCTION TO SIGNUP

exports.signupNewAccount = async function (req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).send("Please provide both username and password");
    } else {
      //CHECK IF USERNAME IS USED OR NOT
      const foundUser = await User.findOne({ username });

      if (foundUser) {
        //IF USERNAME IS USED
        res.status(400).send("The username is used by another user");
      } else {
        //IF USERNAME HAS NOT BEEN USED
        //INSERT NEW USER PROFILE OBJECT
        await User.create({
          username,
          password,
        });
        res.status(201).send("New account has been created");
      }
    }
  } catch (e) {
    console.log(`Signup Error ${e}`);
  }
};
