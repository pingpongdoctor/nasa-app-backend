const mongoose = require("mongoose");

//DEFINE USER SCHEMA
const usersSchema = mongoose.Schema(
  {
    google_id: {
      type: String,
      require: [false],
    },
    username: {
      type: String,
      require: [true],
    },
    password: {
      type: String,
      require: [false],
    },
  },
  {
    timestamps: true,
  }
);

//DEFINE AND EXPORT THE USER MODEL
module.exports = mongoose.model("User", usersSchema);
