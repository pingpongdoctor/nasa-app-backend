const User = require("../models/usersModel");

//CALLBACK FUNCTION TO SIGN UP
exports.signupNewAccount = async function (req, res) {
  try {
    const { username, password } = req.body;

    //IF NO USERNAME AND PASSWORD PROVIDED
    if (!username || !password) {
      res.status(400).send("Please provide both username and password");
    } else {
      //CHECK IF USERNAME HAS BEEN USED BY ANOTHER USER
      const foundUser = await User.findOne({ username });

      if (foundUser) {
        //IF USERNAME HAS BEEN USED
        res.status(400).send("The username is used by another user");
      } else {
        //IF USERNAME HAS NOT BEEN USED, INSERT NEW USER PROFILE OBJECT
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
