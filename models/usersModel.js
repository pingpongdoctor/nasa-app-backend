const mongoose = require("mongoose");

//DEFINE USER SCHEMA
const usersSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: [true],
    },
    password: {
      type: String,
      require: [true],
    },
  },
  {
    timestamps: true,
  }
);

//DEFINE AND EXPORT THE USER MODEL
module.exports = mongoose.model("User", usersSchema);
