const User = require("../models/usersModel");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const PORT = process.env.PORT || 8080;

//Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${PORT}/auth/google/callback`,
    },
    function (_accessToken, _refreshToken, profile, done) {
      const { id: google_id, name: nameObj } = profile;
      //CHECK TO SEE IF THIS USER IS IN DATABASE
      User.findOne({ google_id: google_id, username: nameObj.givenName })
        .then((user) => {
          //IF THIS IS AN AVAILABLE USER IN DB
          if (user) {
            done(null, { _id: user._id });
          }
          //IF THIS IS A NEW USER
          else {
            User.create({ google_id: google_id, username: nameObj.givenName })
              .then((res) => {
                done(null, { _id: res._id });
              })
              .catch((e) => console.log(`Error creating a user ${e}`));
          }
        })
        .catch((e) => console.log(`Error fetching a user ${e}`));
    }
  )
);

//STORE USER ID INTO THE SESSION DATA
passport.serializeUser((userObj, done) => {
  done(null, userObj._id);
});

//STORE USER ID INTO THE REQ.USER
passport.deserializeUser((userId, done) => {
  User.findOne({ _id: userId })
    .then((user) => done(null, { _id: user._id, username: user.username }))
    .catch((e) => {
      console.log("Error finding user");
    });
});

module.exports = passport;
