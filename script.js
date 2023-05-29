const User = require("./models/usersModel");

//CREATE NEW USER
exports.createUser = async function () {
  await User.create({
    email: "thanhnhantran1501@gmail.com",
    password: "12345",
  });
};
