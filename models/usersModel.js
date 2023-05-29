const mongoose = require("mongoose");

//DEFINE USER SCHEMA
const usersSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true],
    },
    //CREDENTIALS
    username: {
      type: String,
      require: [false],
    },
    password: {
      type: String,
      require: [false],
    },
    //GOOGLE AUTHENTICATION
    google_id: {
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
