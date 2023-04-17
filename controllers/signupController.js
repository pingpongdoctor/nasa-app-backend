const User = require("../models/usersModel");

//CALLBACK FUNCTION TO SIGNUP

exports.signupNewAccount = async function (req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).send("Please provide both username and password");
    } else {
      //GET ALL USERS
      const usersData = await User.find({});

      //CHECK IF USERNAME IS DUPLICATE
      const isNotDuplicate = usersData.every(
        (user) => user.username != username
      );

      //IF NOT DUPLICATE
      if (isNotDuplicate) {
        //INSERT NEW USER PROFILE OBJECT
        await User.create({
          username,
          password,
        });
        res.status(201).send("New account has been created");
      } else {
        //IF DUPLICATE
        res.status(400).send("The username is used by another user");
      }
    }
  } catch (e) {
    throw new Error(e);
  }
};
